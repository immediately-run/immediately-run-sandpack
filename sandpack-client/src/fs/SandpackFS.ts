import {
  InMemory,
  fs as zenFs,
  resolveMountConfig,
  mount,
  umount,
} from "@zenfs/core";

/**
 * Per-file UI metadata. The file *content* lives in the filesystem as bytes;
 * everything else (visibility, editability, initial focus) is kept in a sidecar
 * file at {@link META_PATH}.
 */
export interface FileMeta {
  hidden?: boolean;
  active?: boolean;
  readOnly?: boolean;
}

export type FileMetaMap = Record<string, FileMeta>;

/** Shape of the sidecar JSON stored at {@link META_PATH}. */
interface MetaSidecar {
  files: FileMetaMap;
  environment?: string;
  mode?: string;
}

/**
 * Path (within the SandpackFS) of the sidecar metadata file. Anything below
 * `/.sandpack/` is treated as internal and excluded from {@link SandpackFS.list}.
 */
export const META_PATH = "/.sandpack/meta.json";
const META_DIR = "/.sandpack";

export type SandpackFSListener = () => void;

/**
 * Shape Sandpack accepts at the public boundary. Each entry carries the
 * file body (`code`) and any optional {@link FileMeta} flags. The more
 * permissive `string | {...}` form used in user-facing React props is
 * normalized to this object shape before being handed to
 * {@link SandpackFS.fromFiles}.
 */
export type SandpackFilesInput = Record<string, FileMeta & { code: string }>;

let mountCounter = 0;

const normalize = (path: string): string =>
  path.startsWith("/") ? path : `/${path}`;

/**
 * A filesystem-shaped handle over the files Sandpack renders. It wraps a
 * ZenFS @see FileSystem mounted at a unique path prefix so multiple
 * `SandpackProvider` instances stay isolated.
 *
 * All reads / writes are async. Changes emit a single coalesced notification
 * (watcher or explicit helper calls) so React can subscribe via
 * `useSyncExternalStore`.
 */
export class SandpackFS {
  /** Virtual mount point inside the global ZenFS tree, e.g. `/sandpack-42`. */
  private readonly prefix: string;
  private readonly listeners = new Set<SandpackFSListener>();
  private metaCache: FileMetaMap = {};
  private sidecarEnvironment: string | undefined = undefined;
  private sidecarMode: string | undefined = undefined;
  private disposed = false;

  private constructor(prefix: string) {
    this.prefix = prefix;
  }

  /**
   * Create a new filesystem backed by an InMemory store and seed it with the
   * given files.
   */
  static async fromFiles(
    files: SandpackFilesInput = {},
    options: { environment?: string; mode?: string } = {},
  ): Promise<SandpackFS> {
    const id = ++mountCounter;
    const prefix = `/__sandpack_${id}`;

    const backend = await resolveMountConfig({ backend: InMemory });
    mount(prefix, backend);

    const instance = new SandpackFS(prefix);
    if (options.environment !== undefined) {
      instance.sidecarEnvironment = options.environment;
    }
    if (options.mode !== undefined) {
      instance.sidecarMode = options.mode;
    }
    await instance.writeInitial(files);

    return instance;
  }

  /**
   * Adopt an existing ZenFS filesystem. The caller is responsible for its
   * lifecycle - {@link dispose} will unmount but not destroy the underlying
   * store.
   */
  static async fromFileSystem(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    backend: any,
  ): Promise<SandpackFS> {
    const id = ++mountCounter;
    const prefix = `/__sandpack_${id}`;
    mount(prefix, backend);

    const instance = new SandpackFS(prefix);
    await instance.ensureMetaDir();
    await instance.refreshMetaCache();

    return instance;
  }

  // ------------------------------------------------------------------
  // Core file ops
  // ------------------------------------------------------------------

  /**
   * Return every visible file path (leading `/`). Metadata sidecar and
   * everything under `/.sandpack/` is excluded.
   */
  async list(): Promise<string[]> {
    const paths: string[] = [];
    await this.walk("/", paths);
    paths.sort();
    return paths;
  }

  async readFile(path: string): Promise<string> {
    return (await zenFs.promises.readFile(this.toAbs(path), "utf8")) as string;
  }

  async writeFile(path: string, content: string): Promise<void> {
    const abs = this.toAbs(path);
    await this.ensureParent(abs);
    await zenFs.promises.writeFile(abs, content);
    this.notify();
  }

  async unlink(path: string): Promise<void> {
    await zenFs.promises.unlink(this.toAbs(path));

    const normalized = normalize(path);
    if (normalized in this.metaCache) {
      delete this.metaCache[normalized];
      await this.persistMeta();
    }

    this.notify();
  }

  async exists(path: string): Promise<boolean> {
    try {
      await zenFs.promises.stat(this.toAbs(path));
      return true;
    } catch {
      return false;
    }
  }

  // ------------------------------------------------------------------
  // Metadata
  // ------------------------------------------------------------------

  getAllMetadata(): FileMetaMap {
    return { ...this.metaCache };
  }

  getMetadata(path: string): FileMeta {
    return { ...(this.metaCache[normalize(path)] ?? {}) };
  }

  async setMetadata(path: string, patch: FileMeta): Promise<void> {
    const key = normalize(path);
    const next: FileMeta = { ...(this.metaCache[key] ?? {}), ...patch };

    Object.keys(next).forEach((k) => {
      if ((next as Record<string, unknown>)[k] === undefined) {
        delete (next as Record<string, unknown>)[k];
      }
    });

    if (Object.keys(next).length === 0) {
      delete this.metaCache[key];
    } else {
      this.metaCache[key] = next;
    }

    await this.persistMeta();
    this.notify();
  }

  getEnvironment(): string | undefined {
    return this.sidecarEnvironment;
  }

  async setEnvironment(environment: string): Promise<void> {
    this.sidecarEnvironment = environment;
    await this.persistMeta();
  }

  getMode(): string | undefined {
    return this.sidecarMode;
  }

  async setMode(mode: string): Promise<void> {
    this.sidecarMode = mode;
    await this.persistMeta();
  }

  // ------------------------------------------------------------------
  // Change detection
  // ------------------------------------------------------------------

  /** Subscribe to any mutation (writeFile/unlink/metadata). */
  watch(cb: SandpackFSListener): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  // ------------------------------------------------------------------
  // Lifecycle
  // ------------------------------------------------------------------

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    try {
      umount(this.prefix);
    } catch {
      // already unmounted
    }

    this.listeners.clear();
  }

  // ------------------------------------------------------------------
  // Internals
  // ------------------------------------------------------------------

  private toAbs(path: string): string {
    const p = normalize(path);
    return `${this.prefix}${p}`;
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error("[sandpack-client]: SandpackFS listener threw", err);
      }
    });
  }

  private async ensureMetaDir(): Promise<void> {
    try {
      await zenFs.promises.mkdir(`${this.prefix}${META_DIR}`, {
        recursive: true,
      });
    } catch {
      // already exists
    }
  }

  private async ensureParent(absPath: string): Promise<void> {
    const lastSlash = absPath.lastIndexOf("/");
    if (lastSlash <= 0) return;
    const dir = absPath.slice(0, lastSlash);
    if (!dir || dir === this.prefix) return;
    try {
      await zenFs.promises.mkdir(dir, { recursive: true });
    } catch {
      // exists
    }
  }

  private async walk(relDir: string, out: string[]): Promise<void> {
    const absDir = this.toAbs(relDir);
    let entries: string[];
    try {
      entries = (await zenFs.promises.readdir(absDir)) as string[];
    } catch {
      return;
    }

    for (const entry of entries) {
      const relPath = (relDir === "/" ? "" : relDir) + "/" + entry;
      if (relPath.startsWith(META_DIR)) continue;

      const absEntry = this.toAbs(relPath);
      let isDir = false;
      try {
        const stat = await zenFs.promises.stat(absEntry);
        isDir = stat.isDirectory();
      } catch {
        continue;
      }

      if (isDir) {
        await this.walk(relPath, out);
      } else {
        out.push(relPath);
      }
    }
  }

  private async writeInitial(files: SandpackFilesInput): Promise<void> {
    await this.ensureMetaDir();

    const meta: FileMetaMap = {};
    for (const [rawPath, entry] of Object.entries(files)) {
      const path = normalize(rawPath);
      const abs = this.toAbs(path);
      await this.ensureParent(abs);

      await zenFs.promises.writeFile(abs, entry.code);

      const fileMeta: FileMeta = {};
      if (entry.hidden !== undefined) fileMeta.hidden = entry.hidden;
      if (entry.active !== undefined) fileMeta.active = entry.active;
      if (entry.readOnly !== undefined) fileMeta.readOnly = entry.readOnly;
      if (Object.keys(fileMeta).length > 0) meta[path] = fileMeta;
    }

    this.metaCache = meta;
    await this.persistMeta();
  }

  private async persistMeta(): Promise<void> {
    await this.ensureMetaDir();
    const sidecar: MetaSidecar = { files: this.metaCache };
    if (this.sidecarEnvironment !== undefined) {
      sidecar.environment = this.sidecarEnvironment;
    }
    if (this.sidecarMode !== undefined) {
      sidecar.mode = this.sidecarMode;
    }
    await zenFs.promises.writeFile(
      this.toAbs(META_PATH),
      JSON.stringify(sidecar),
    );
  }

  private async refreshMetaCache(): Promise<void> {
    try {
      const raw = (await zenFs.promises.readFile(
        this.toAbs(META_PATH),
        "utf8",
      )) as string;
      const parsed = JSON.parse(raw) as MetaSidecar | FileMetaMap;
      if ("files" in parsed && typeof parsed.files === "object") {
        this.metaCache = parsed.files;
        this.sidecarEnvironment = parsed.environment;
        this.sidecarMode = parsed.mode;
      } else {
        // Legacy format: plain FileMetaMap
        this.metaCache = parsed as FileMetaMap;
      }
    } catch {
      this.metaCache = {};
    }
  }
}
