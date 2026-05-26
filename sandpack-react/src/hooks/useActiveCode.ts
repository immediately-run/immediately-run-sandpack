import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (isLoading || !activeFile) return;
    let cancelled = false;
    // Guards against out-of-order reads clobbering newer content: only the most
    // recently started load is allowed to commit its result.
    let generation = 0;

    const load = async () => {
      const current = ++generation;
      setLoadingContent(true);
      try {
        const body = await fs.readFile(activeFile);
        if (!cancelled && current === generation) setCode(body);
      } catch {
        if (!cancelled && current === generation) setCode("");
      } finally {
        if (!cancelled && current === generation) setLoadingContent(false);
      }
    };

    void load();

    // Refresh whenever the filesystem mutates so writes that bypass SandpackFS
    // (e.g. from a worker on the shared filesystem) still update the editor.
    const unsub = watchFs(fs, () => void load());

    return () => {
      cancelled = true;
      unsub();
    };
  }, [fs, activeFile, isLoading]);

  const readOnly = Boolean(fileMeta[activeFile]?.readOnly);

  return {
    code,
    readOnly,
    isLoading: isLoading || loadingContent,
    updateCode: updateCurrentFile,
  };
};
