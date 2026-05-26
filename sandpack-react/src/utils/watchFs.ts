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
 * @returns an unsubscribe function.
 */
export const watchFs = (fs: SandpackFS, callback: () => void): (() => void) => {
  let pending: ReturnType<typeof setTimeout> | undefined;

  const watcher = fs.fsContext.fs.watch("/", { recursive: true }, () => {
    if (pending !== undefined) clearTimeout(pending);
    pending = setTimeout(() => {
      pending = undefined;
      callback();
    }, 0);
  });

  return () => {
    if (pending !== undefined) clearTimeout(pending);
    watcher.close();
  };
};
