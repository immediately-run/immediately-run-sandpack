import type {
  FileMetaMap,
  SandpackFS,
} from "@codesandbox/sandpack-client";
import { normalizePath } from "@codesandbox/sandpack-client";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  SandboxEnvironment,
  SandpackFiles,
  SandpackPredefinedTemplate,
  SandpackProviderProps,
  TemplateFiles,
} from "../..";
import {
  convertedFilesToBundlerFiles,
  getSandpackStateFromProps,
  materializeSandpackFS,
} from "../../utils/sandpackUtils";

export interface FilesState {
  fs: SandpackFS;
  fileList: string[];
  fileMeta: FileMetaMap;
  environment?: SandboxEnvironment;
  visibleFiles: Array<TemplateFiles<SandpackPredefinedTemplate> | string>;
  activeFile: TemplateFiles<SandpackPredefinedTemplate> | string;
  shouldUpdatePreview: boolean;
  /** True while the async initialization of the filesystem is in flight. */
  isLoading: boolean;
}

interface FilesOperations {
  openFile: (path: string) => void;
  resetFile: (path: string) => Promise<void>;
  resetAllFiles: () => Promise<void>;
  setActiveFile: (path: string) => void;
  updateCurrentFile: (
    code: string,
    shouldUpdatePreview?: boolean,
  ) => Promise<void>;
  updateFile: (
    pathOrFiles: string | SandpackFiles,
    code?: string,
    shouldUpdatePreview?: boolean,
  ) => Promise<void>;
  addFile: (
    pathOrFiles: string | SandpackFiles,
    code?: string,
    shouldUpdatePreview?: boolean,
  ) => Promise<void>;
  closeFile: (path: string) => void;
  deleteFile: (path: string, shouldUpdatePreview?: boolean) => Promise<void>;
}

export type UseFiles = (props: SandpackProviderProps) => [
  FilesState & {
    visibleFilesFromProps: Array<
      TemplateFiles<SandpackPredefinedTemplate> | string
    >;
  },
  FilesOperations,
];

interface UIState {
  visibleFiles: string[];
  activeFile: string;
  visibleFilesFromProps: string[];
  environment?: SandboxEnvironment;
  shouldUpdatePreview: boolean;
}

interface FSState {
  fs: SandpackFS | null;
  fileList: string[];
  fileMeta: FileMetaMap;
  isLoading: boolean;
}

const EMPTY_LIST: string[] = [];
const EMPTY_META: FileMetaMap = {};

/**
 * Managers the {@link SandpackFS} lifecycle for a provider.
 *
 * - The UI-level plan (visibleFiles, activeFile, environment) is computed
 *   synchronously on first render so consumers never see an empty editor.
 * - The live filesystem is created asynchronously; while that's in-flight
 *   `isLoading` is `true` and a placeholder is handed out.
 * - Once the fs is live we mirror its contents (`fileList` + metadata) into
 *   state via the fs's own `watch()` callback. This avoids tripping
 *   `useSyncExternalStore`'s snapshot-identity requirement with ZenFS'
 *   freshly-allocated objects.
 */
export const useFiles: UseFiles = (props) => {
  /**
   * When the caller supplies their own `props.fs`, we can't run the static
   * planner (it would synthesise a template, ignoring the live fs). Instead
   * we defer the plan to the async init effect, which lists the fs and
   * derives visibleFiles/activeFile from its metadata sidecar.
   *
   * The plan is frozen on first render: changing `files`/`template` after
   * mount is intentionally a no-op so we don't restart the filesystem under
   * React's feet. Consumers who need to swap setups should unmount the
   * provider instead.
   */
  const planRef = useRef<ReturnType<typeof getSandpackStateFromProps> | null>(
    null,
  );
  if (planRef.current === null && !props.fs) {
    planRef.current = getSandpackStateFromProps(props);
  }
  const plan = planRef.current;

  const [uiState, setUiState] = useState<UIState>(() => ({
    visibleFiles: plan?.visibleFiles ?? [],
    activeFile: plan?.activeFile ?? "",
    visibleFilesFromProps: plan?.visibleFiles ?? [],
    environment: plan?.environment,
    shouldUpdatePreview: true,
  }));

  const [fsState, setFsState] = useState<FSState>({
    fs: null,
    fileList: EMPTY_LIST,
    fileMeta: EMPTY_META,
    isLoading: true,
  });

  /**
   * Snapshot of the original file contents at mount so we can implement
   * `resetFile` / `resetAllFiles`. Captured once, in the same async pass that
   * builds the filesystem.
   */
  const originalSnapshotRef = useRef<Record<string, string>>({});
  const ownsFsRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const fs: SandpackFS = props.fs
        ? props.fs
        : await materializeSandpackFS(plan!.files);

      if (cancelled) {
        if (!props.fs) fs.dispose();
        return;
      }

      ownsFsRef.current = !props.fs;

      const paths = await fs.list();
      const snap: Record<string, string> = {};
      await Promise.all(
        paths.map(async (p) => {
          snap[p] = await fs.readFile(p);
        }),
      );
      if (cancelled) {
        if (ownsFsRef.current) fs.dispose();
        return;
      }
      originalSnapshotRef.current = snap;

      // When the caller supplied their own fs, patch the UI plan now that
      // we've inspected the metadata sidecar.
      if (props.fs) {
        const meta = fs.getAllMetadata();
        const visible: string[] = [];
        let active: string | undefined = props.options?.activeFile
          ? normalizePath(props.options.activeFile)
          : undefined;

        paths.forEach((p) => {
          const m = meta[p] ?? {};
          if (!active && m.active) active = p;
          if (!m.hidden) visible.push(p);
        });

        if (visible.length === 0 && paths.length > 0) visible.push(paths[0]);
        if (!active) active = visible[0] ?? paths[0] ?? "/";
        if (active && !visible.includes(active)) visible.push(active);

        setUiState((prev) => ({
          ...prev,
          visibleFiles: visible,
          visibleFilesFromProps: visible,
          activeFile: active!,
        }));
      }

      setFsState({
        fs,
        fileList: paths,
        fileMeta: fs.getAllMetadata(),
        isLoading: false,
      });
    }

    void init();

    return () => {
      cancelled = true;
    };
    // Intentionally mount-only: see planRef comment above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fs = fsState.fs;
    if (!fs) return;

    let cancelled = false;

    const refresh = async () => {
      const paths = await fs.list();
      if (cancelled) return;
      setFsState((prev) => {
        if (!prev.fs) return prev;
        return { ...prev, fileList: paths, fileMeta: fs.getAllMetadata() };
      });
    };

    const unsub = fs.watch(() => {
      void refresh();
    });

    return () => {
      cancelled = true;
      unsub();
      if (ownsFsRef.current) fs.dispose();
    };
  }, [fsState.fs]);

  // ------------------------------------------------------------------
  // Operations
  // ------------------------------------------------------------------

  const updateFile = useCallback(
    async (
      pathOrFiles: string | SandpackFiles,
      code?: string,
      shouldUpdatePreview = true,
    ): Promise<void> => {
      const fs = fsState.fs;
      if (!fs) return;

      if (typeof pathOrFiles === "string" && typeof code === "string") {
        await fs.writeFile(pathOrFiles, code);
      } else if (typeof pathOrFiles === "object") {
        const entries = convertedFilesToBundlerFiles(pathOrFiles);
        await Promise.all(
          Object.entries(entries).map(async ([path, entry]) => {
            await fs.writeFile(path, entry.code);
            const { hidden, active, readOnly } = entry;
            if (
              hidden !== undefined ||
              active !== undefined ||
              readOnly !== undefined
            ) {
              await fs.setMetadata(path, { hidden, active, readOnly });
            }
          }),
        );
      }

      setUiState((prev) => ({ ...prev, shouldUpdatePreview }));
    },
    [fsState.fs],
  );

  const operations: FilesOperations = useMemo(
    () => ({
      openFile: (path: string) => {
        setUiState((prev) => {
          const newPaths = prev.visibleFiles.includes(path)
            ? prev.visibleFiles
            : [...prev.visibleFiles, path];
          return { ...prev, activeFile: path, visibleFiles: newPaths };
        });
      },
      resetFile: async (path: string) => {
        const fs = fsState.fs;
        if (!fs) return;
        const original = originalSnapshotRef.current[path];
        if (original !== undefined) {
          await fs.writeFile(path, original);
        }
      },
      resetAllFiles: async () => {
        const fs = fsState.fs;
        if (!fs) return;
        await Promise.all(
          Object.entries(originalSnapshotRef.current).map(([path, body]) =>
            fs.writeFile(path, body),
          ),
        );
      },
      setActiveFile: (activeFile: string) => {
        setUiState((prev) => ({ ...prev, activeFile }));
      },
      updateCurrentFile: async (
        code: string,
        shouldUpdatePreview = true,
      ) => {
        await updateFile(uiState.activeFile, code, shouldUpdatePreview);
      },
      updateFile,
      addFile: updateFile,
      closeFile: (path: string) => {
        setUiState((prev) => {
          if (prev.visibleFiles.length === 1) return prev;
          const indexOfRemoved = prev.visibleFiles.indexOf(path);
          const newPaths = prev.visibleFiles.filter((p) => p !== path);
          return {
            ...prev,
            activeFile:
              path === prev.activeFile
                ? indexOfRemoved === 0
                  ? prev.visibleFiles[1]
                  : prev.visibleFiles[indexOfRemoved - 1]
                : prev.activeFile,
            visibleFiles: newPaths,
          };
        });
      },
      deleteFile: async (path: string, shouldUpdatePreview = true) => {
        const fs = fsState.fs;
        if (!fs) return;
        await fs.unlink(path);

        setUiState((prev) => {
          const remainingVisible = prev.visibleFiles.filter((p) => p !== path);
          if (remainingVisible.length === 0) {
            const nextFile =
              fsState.fileList.filter((p) => p !== path).pop() ?? "/";
            return {
              ...prev,
              visibleFiles: [nextFile],
              activeFile: nextFile,
              shouldUpdatePreview,
            };
          }
          return {
            ...prev,
            visibleFiles: remainingVisible,
            activeFile:
              path === prev.activeFile
                ? remainingVisible[remainingVisible.length - 1]
                : prev.activeFile,
            shouldUpdatePreview,
          };
        });
      },
    }),
    [fsState.fs, fsState.fileList, updateFile, uiState.activeFile],
  );

  const state: FilesState & {
    visibleFilesFromProps: Array<
      TemplateFiles<SandpackPredefinedTemplate> | string
    >;
  } = {
    fs: (fsState.fs ?? (placeholderFs() as unknown as SandpackFS)) as SandpackFS,
    fileList: fsState.fileList,
    fileMeta: fsState.fileMeta,
    environment: uiState.environment,
    visibleFiles: uiState.visibleFiles,
    activeFile: uiState.activeFile,
    visibleFilesFromProps: uiState.visibleFilesFromProps,
    shouldUpdatePreview: uiState.shouldUpdatePreview,
    isLoading: fsState.isLoading,
  };

  return [state, operations];
};

/**
 * Lightweight stand-in used until the real {@link SandpackFS} has resolved.
 * Every mutating method throws a descriptive error so mis-timed calls
 * surface loudly instead of silently producing stale data.
 */
function placeholderFs(): Partial<SandpackFS> {
  const err = () => {
    throw new Error(
      "[sandpack-react]: filesystem not ready yet - wait for `sandpack.isLoading === false`",
    );
  };
  return {
    list: () => Promise.resolve([]),
    readFile: err as unknown as SandpackFS["readFile"],
    writeFile: err as unknown as SandpackFS["writeFile"],
    unlink: err as unknown as SandpackFS["unlink"],
    exists: () => Promise.resolve(false),
    getAllMetadata: () => EMPTY_META,
    getMetadata: () => ({}),
    setMetadata: err as unknown as SandpackFS["setMetadata"],
    watch: () => () => undefined,
    dispose: () => undefined,
  };
}
