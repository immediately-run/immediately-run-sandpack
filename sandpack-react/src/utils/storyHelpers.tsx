import type { SandpackFS } from "@codesandbox/sandpack-client";
import React from "react";

import type { CreateSandpackFSOptions } from "./createSandpackFS";
import { createSandpackFS } from "./createSandpackFS";

/**
 * Async-resolving hook for story files. Creates a SandpackFS from the given
 * options on mount and disposes it on unmount. Returns null while initializing.
 */
export const useSandpackFS = (
  options: CreateSandpackFSOptions = {},
): SandpackFS | null => {
  const [fs, setFs] = React.useState<SandpackFS | null>(null);

  React.useEffect(() => {
    let live = true;
    createSandpackFS(options).then((newFs) => {
      if (live) {
        setFs(newFs);
      } else {
        newFs.dispose();
      }
    });
    return () => {
      live = false;
      setFs((prev) => {
        prev?.dispose();
        return null;
      });
    };
    // Options are treated as mount-time config, not reactive deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return fs;
};
