import type { SandpackFS } from "@codesandbox/sandpack-client";
import { useEffect, useRef, useState } from "react";

import type { SandpackProviderProps } from "../..";
import { watchFs } from "../../utils/watchFs";

interface SandpackAppState {
  editorState: "pristine" | "dirty";
}

type UseAppState = (
  props: SandpackProviderProps,
  fs: SandpackFS | null,
  fileList: string[],
) => SandpackAppState;

/**
 * Tracks whether the user has edited any file relative to the initial
 * contents. A "pristine" snapshot is captured on the first render with a
 * resolved filesystem, and subsequent fs notifications trigger content
 * comparisons.
 */
export const useAppState: UseAppState = (_props, fs, fileList) => {
  const [state, setState] = useState<SandpackAppState>({
    editorState: "pristine",
  });

  const snapshotRef = useRef<Record<string, string> | null>(null);

  useEffect(() => {
    if (!fs) return;

    let cancelled = false;

    const refresh = async () => {
      const paths = await fs.list();
      const entries = await Promise.all(
        paths.map(async (p) => [p, await fs.readFile(p)] as const),
      );
      const current = Object.fromEntries(entries);

      if (cancelled) return;

      if (snapshotRef.current === null) {
        snapshotRef.current = current;
        return;
      }

      const snap = snapshotRef.current;
      const snapKeys = Object.keys(snap);
      const curKeys = Object.keys(current);
      const dirty =
        snapKeys.length !== curKeys.length ||
        snapKeys.some((k) => snap[k] !== current[k]);

      setState((prev) => {
        const next = dirty ? "dirty" : "pristine";
        return next === prev.editorState ? prev : { editorState: next };
      });
    };

    void refresh();
    // Recompute dirty/pristine on any mutation, incl. writes that bypass
    // SandpackFS (e.g. a worker on the shared filesystem).
    const unsub = watchFs(fs, () => void refresh());

    return () => {
      cancelled = true;
      unsub();
    };
    // re-run when fs changes (new provider mount or legacy -> fs swap)
  }, [fs, fileList.length]);

  return state;
};
