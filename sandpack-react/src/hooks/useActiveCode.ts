import { useEffect, useState } from "react";

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

    const load = async () => {
      setLoadingContent(true);
      try {
        const body = await fs.readFile(activeFile);
        if (!cancelled) setCode(body);
      } catch {
        if (!cancelled) setCode("");
      } finally {
        if (!cancelled) setLoadingContent(false);
      }
    };

    void load();

    // Refresh whenever the filesystem mutates (includes this file or not - we
    // pay the extra read to stay consistent with external writers).
    const unsub = fs.fsContext.fs.watch(() => {
      void load();
    });

    return () => {
      cancelled = true;
      if (typeof unsub === "function") unsub();
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
