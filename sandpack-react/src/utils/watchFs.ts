import type { SandpackFS } from "@codesandbox/sandpack-client";

/**
 * Subscribe to *every* mutation of the underlying ZenFS filesystem — including
 * writes that bypass {@link SandpackFS} (e.g. a worker writing directly to the
 * shared filesystem).
 *
 * ZenFS emits its change events *during* a write (between its internal
 * open/write/truncate steps), so reading the file straight from the listener
 * races with the write and can observe torn/partial content. To avoid that we
 * defer the callback to a macrotask: by the time it runs the in-flight write
 * (and its awaited promise chain) has settled. Deferring also coalesces the
 * several events a single write emits into one callback.
 *
 * The callback receives the set of changed paths (leading `/`) observed since
 * the last invocation so they can be relayed to the bundler.
 *
 * @returns an unsubscribe function.
 */
export const watchFs = (
  fs: SandpackFS,
  callback: (paths: string[]) => void,
): (() => void) => {
  let pending: ReturnType<typeof setTimeout> | undefined;
  let changed = new Set<string>();

  const watcher = fs.fsContext.fs.watch(
    "/",
    { recursive: true },
    (_eventType, filename) => {
      if (filename) {
        const path = filename.toString();
        changed.add(path.startsWith("/") ? path : `/${path}`);
      }
      if (pending !== undefined) clearTimeout(pending);
      pending = setTimeout(() => {
        pending = undefined;
        const paths = Array.from(changed);
        changed = new Set();
        callback(paths);
      }, 0);
    },
  );

  return () => {
    if (pending !== undefined) clearTimeout(pending);
    watcher.close();
  };
};
