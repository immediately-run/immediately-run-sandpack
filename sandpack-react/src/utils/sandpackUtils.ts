import type { SandpackFilesInput } from "@codesandbox/sandpack-client";
import {
  SandpackFS,
  addPackageJSONIfNeededToMap,
  normalizePath,
} from "@codesandbox/sandpack-client";

import { SANDBOX_TEMPLATES } from "../templates";
import type {
  SandboxTemplate,
  SandpackPredefinedTemplate,
  SandpackProviderProps,
  SandpackSetup,
  SandpackFiles,
  SandboxEnvironment,
} from "../types";

export interface SandpackPlannedState {
  /**
   * Normalized file map with every entry in `{code, ...meta}` form. This is
   * the planning view - synchronous and free of I/O - which can be handed
   * to {@link materializeSandpackFS} to produce the live filesystem.
   */
  files: SandpackFilesInput;
  visibleFiles: string[];
  activeFile: string;
  environment: SandboxEnvironment;
  entry?: string;
}

/**
 * Pure, synchronous planner that resolves the final file layout
 * (template + user overrides), the active file, and the visible subset from
 * {@link SandpackProviderProps}. No filesystem mutations are performed here -
 * use {@link materializeSandpackFS} or adopt `props.fs` to obtain a live
 * {@link SandpackFS}.
 */
export const getSandpackStateFromProps = (
  props: SandpackProviderProps,
): SandpackPlannedState => {
  const normalizedFilesPath = normalizePath(props.files) ?? {};
  const projectSetup = combineTemplateFilesToSetup({
    template: props.template,
    customSetup: props.customSetup,
    files: normalizedFilesPath,
  });

  let visibleFiles: string[] = normalizePath(props.options?.visibleFiles ?? []);
  let activeFile = props.options?.activeFile
    ? resolveFileInMap(props.options?.activeFile, projectSetup.files)
    : undefined;

  if (visibleFiles.length === 0 && normalizedFilesPath) {
    Object.keys(normalizedFilesPath).forEach((filePath) => {
      const file = normalizedFilesPath[filePath];
      if (typeof file === "string") {
        visibleFiles.push(filePath);
        return;
      }
      if (!activeFile && file.active) {
        activeFile = filePath;
        if (file.hidden === true) visibleFiles.push(filePath);
      }
      if (!file.hidden) visibleFiles.push(filePath);
    });
  }

  if (visibleFiles.length === 0) visibleFiles = [projectSetup.main];

  if (projectSetup.entry && !projectSetup.files[projectSetup.entry]) {
    projectSetup.entry =
      resolveFileInMap(projectSetup.entry, projectSetup.files) ?? undefined;
  }

  if (!activeFile && projectSetup.main) activeFile = projectSetup.main;
  if (!activeFile || !projectSetup.files[activeFile]) {
    activeFile = visibleFiles[0];
  }
  if (!visibleFiles.includes(activeFile)) visibleFiles.push(activeFile);

  /**
   * Seed a `/package.json` if the caller didn't supply one. We used to do
   * this inside the runtime client; keeping it here means the planning
   * view already reflects the final dependency map, and consumers that
   * render metadata (tests, storybook) don't have to materialize a fs
   * just to read deps.
   */
  const files = addPackageJSONIfNeededToMap(
    projectSetup.files,
    projectSetup.dependencies ?? {},
    projectSetup.devDependencies ?? {},
    projectSetup.entry,
  );

  const existOpenPath = visibleFiles.filter((p) => files[p]);

  return {
    files,
    visibleFiles: existOpenPath,
    activeFile: activeFile!,
    environment: projectSetup.environment,
    entry: projectSetup.entry,
  };
};

/**
 * Materialize a plan into a live {@link SandpackFS}. Separating this from
 * {@link getSandpackStateFromProps} keeps planning testable and lets React
 * hooks own the async lifecycle of the filesystem.
 */
export const materializeSandpackFS = (
  files: SandpackFilesInput,
): Promise<SandpackFS> => SandpackFS.fromFiles(files);

/**
 * Given a file tree and a file, it uses a couple of rules
 * to tweak the filename to match with one of the inside of file tree
 *
 * - Adds the leading slash;
 * - Tries to find the same filename with different extensions (js only);
 * - Returns `null` if it doesn't satisfy any rule
 */
export const resolveFile = (
  path: string,
  files: SandpackFiles,
): string | null => resolveFileInMap(path, files);

function resolveFileInMap(
  path: string,
  files: SandpackFiles | SandpackFilesInput,
): string | null {
  const normalizedFilesPath = normalizePath(files);
  const normalizedPath = normalizePath(path);

  if (normalizedPath in normalizedFilesPath) return normalizedPath;
  if (!path) return null;

  let resolvedPath: string | null = null;
  let index = 0;
  const strategies = [".js", ".jsx", ".ts", ".tsx"];

  while (!resolvedPath && index < strategies.length) {
    const removeExtension = normalizedPath.split(".")[0];
    const attemptPath = `${removeExtension}${strategies[index]}`;

    if (normalizedFilesPath[attemptPath] !== undefined) {
      resolvedPath = attemptPath;
    }

    index++;
  }

  return resolvedPath;
}

const combineTemplateFilesToSetup = ({
  files,
  template,
  customSetup,
}: {
  files?: SandpackFiles;
  template?: SandpackPredefinedTemplate;
  customSetup?: SandpackSetup;
}): SandboxTemplate => {
  if (!template) {
    if (!customSetup) {
      const defaultTemplate =
        SANDBOX_TEMPLATES.vanilla as unknown as SandboxTemplate;

      return {
        ...defaultTemplate,
        files: {
          ...defaultTemplate.files,
          ...convertedFilesToBundlerFiles(files),
        },
      } as unknown as SandboxTemplate;
    }

    if (!files || Object.keys(files).length === 0) {
      throw new Error(
        `[sandpack-react]: without a template, you must pass at least one file`,
      );
    }

    return {
      ...customSetup,
      files: convertedFilesToBundlerFiles(files),
    } as SandboxTemplate;
  }

  const baseTemplate = SANDBOX_TEMPLATES[
    template
  ] as unknown as SandboxTemplate;
  if (!baseTemplate) {
    throw new Error(
      `[sandpack-react]: invalid template "${template}" provided`,
    );
  }

  if (!customSetup && !files) return baseTemplate;

  return {
    files: convertedFilesToBundlerFiles({ ...baseTemplate.files, ...files }),
    dependencies: {
      ...baseTemplate.dependencies,
      ...customSetup?.dependencies,
    },
    devDependencies: {
      ...baseTemplate.devDependencies,
      ...customSetup?.devDependencies,
    },
    entry: normalizePath(customSetup?.entry),
    main: baseTemplate.main,
    environment: customSetup?.environment || baseTemplate.environment,
  } as SandboxTemplate;
};

/**
 * Normalize a mixed `SandpackFiles` (strings or objects) into the
 * `{code, ...meta}` shape consumed by {@link SandpackFS.fromFiles}.
 */
export const convertedFilesToBundlerFiles = (
  files?: SandpackFiles,
): SandpackFilesInput => {
  if (!files) return {};

  return Object.keys(files).reduce<SandpackFilesInput>((acc, key) => {
    const entry = files[key];
    if (typeof entry === "string") {
      acc[key] = { code: entry };
    } else {
      acc[key] = {
        code: entry.code,
        ...(entry.hidden !== undefined ? { hidden: entry.hidden } : {}),
        ...(entry.active !== undefined ? { active: entry.active } : {}),
        ...(entry.readOnly !== undefined ? { readOnly: entry.readOnly } : {}),
      };
    }
    return acc;
  }, {});
};
