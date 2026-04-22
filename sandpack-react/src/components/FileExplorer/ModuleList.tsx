import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import * as React from "react";

import type { SandpackOptions } from "../../types";

import { File } from "./File";
import { fromPropsToModules } from "./utils";

import type { SandpackFileExplorerProp } from ".";

export interface ModuleListProps extends SandpackFileExplorerProp {
  prefixedPath: string;
  files: SandpackBundlerFiles;
  selectFile: (path: string) => void;
  activeFile: NonNullable<SandpackOptions["activeFile"]>;
  depth?: number;
  visibleFiles: NonNullable<SandpackOptions["visibleFiles"]>;
}

export interface DirectoryProps extends SandpackFileExplorerProp {
  prefixedPath: string;
  files: SandpackBundlerFiles;
  selectFile: (path: string) => void;
  activeFile: NonNullable<SandpackOptions["activeFile"]>;
  depth: number;
  visibleFiles: NonNullable<SandpackOptions["visibleFiles"]>;
}

export const Directory: React.FC<DirectoryProps> = ({
  prefixedPath,
  files,
  selectFile,
  activeFile,
  depth,
  autoHiddenFiles,
  visibleFiles,
  initialCollapsedFolder,
}) => {
  const [open, setOpen] = React.useState(
    !initialCollapsedFolder?.includes(prefixedPath),
  );

  const toggle = (): void => setOpen((prev) => !prev);

  return (
    <div key={prefixedPath}>
      <File
        depth={depth}
        isDirOpen={open}
        onClick={toggle}
        path={prefixedPath + "/"}
      />

      {open && (
        <ModuleList
          activeFile={activeFile}
          autoHiddenFiles={autoHiddenFiles}
          depth={depth + 1}
          files={files}
          initialCollapsedFolder={initialCollapsedFolder}
          prefixedPath={prefixedPath}
          selectFile={selectFile}
          visibleFiles={visibleFiles}
        />
      )}
    </div>
  );
};

export const ModuleList: React.FC<ModuleListProps> = ({
  depth = 0,
  activeFile,
  selectFile,
  prefixedPath,
  files,
  autoHiddenFiles,
  visibleFiles,
  initialCollapsedFolder,
}) => {
  const { directories, modules } = fromPropsToModules({
    visibleFiles,
    autoHiddenFiles,
    prefixedPath,
    files,
  });

  return (
    <div>
      {directories.map((dir) => (
        <Directory
          key={dir}
          activeFile={activeFile}
          autoHiddenFiles={autoHiddenFiles}
          depth={depth}
          files={files}
          initialCollapsedFolder={initialCollapsedFolder}
          prefixedPath={dir}
          selectFile={selectFile}
          visibleFiles={visibleFiles}
        />
      ))}

      {modules.map((file) => (
        <File
          key={file}
          active={activeFile === file}
          depth={depth}
          path={file}
          selectFile={selectFile}
        />
      ))}
    </div>
  );
};
