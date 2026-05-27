import { useCallback, useEffect, useRef, useState } from "react";

import { watchFs } from "../utils/watchFs";

import { useSandpack } from "./useSandpack";

/**
 * Returns the current contents of the active file together with helpers to
 * edit it. Content is fetched asynchronously from the backing
 * {@link import("@codesandbox/sandpack-client").SandpackFS} so
 * `code` is `undefined` until the first read resolves (reflected via
 * `isLoading`).
 *
 * @category Hooks
 */
export const useActiveCode = (): {
  code: string;
  readOnly: boolean;
  isLoading: boolean;
  updateCode: (newCode: string, shouldUpdatePreview?: boolean) => Promise<void>;
} => {
  const { sandpack } = useSandpack();
  const { fs, activeFile, fileMeta, updateCurrentFile, isLoading } = sandpack;

  const [code, setCode] = useState<string>("");
  const [loadingContent, setLoadingContent] = useState(true);

  // Mirror `code` into a ref so the async loader can compare against the latest
  // value without having to be re-created on every keystroke.
  const codeRef = useRef(code);
  const commitCode = useCallback((value: string) => {
    codeRef.current = value;
    setCode(value);
  }, []);

  // Count of editor-originated writes that haven't settled yet. While this is
  // > 0 the editor owns the active file, so a filesystem reload must not push
  // content back into it: the editor already has the latest text, and a
  // slightly-stale read landing mid-keystroke would revert/overwrite what was
  // just typed.
  const pendingWrites = useRef(0);

  useEffect(() => {
    if (isLoading || !activeFile) return;
    let cancelled = false;
    // Guards against out-of-order reads clobbering newer content: only the most
    // recently started load is allowed to commit its result.
    let generation = 0;

    const load = async (isExternal: boolean): Promise<void> => {
      const current = ++generation;
      if (!isExternal) setLoadingContent(true);
      try {
        const body = await fs.readFile(activeFile);
        if (cancelled || current !== generation) return;
        // Ignore filesystem-driven refreshes that merely echo the editor's own
        // (possibly still in-flight) writes — applying them would clobber
        // active typing. Genuine external changes (different content, no
        // pending local writes) still flow through.
        if (
          isExternal &&
          (pendingWrites.current > 0 || body === codeRef.current)
        ) {
          return;
        }
        commitCode(body);
      } catch {
        if (!cancelled && current === generation && !isExternal) commitCode("");
      } finally {
        if (!cancelled && current === generation && !isExternal) {
          setLoadingContent(false);
        }
      }
    };

    void load(false);

    // Refresh whenever the filesystem mutates so writes that bypass the editor
    // (e.g. from a worker on the shared filesystem) still update it.
    const unsub = watchFs(fs, () => void load(true));

    return () => {
      cancelled = true;
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fs, activeFile, isLoading]);

  const updateCode = useCallback(
    async (newCode: string, shouldUpdatePreview = true): Promise<void> => {
      // Reflect the edit immediately so `code` tracks the editor without a
      // filesystem round-trip (that round-trip is what raced with typing), and
      // mark the write pending so reloads don't clobber it before it settles.
      commitCode(newCode);
      pendingWrites.current += 1;
      try {
        await updateCurrentFile(newCode, shouldUpdatePreview);
      } finally {
        pendingWrites.current -= 1;
      }
    },
    [updateCurrentFile, commitCode],
  );

  const readOnly = Boolean(fileMeta[activeFile]?.readOnly);

  return {
    code,
    readOnly,
    isLoading: isLoading || loadingContent,
    updateCode,
  };
};
