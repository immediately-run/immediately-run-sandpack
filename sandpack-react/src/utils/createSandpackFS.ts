import type { SandpackFilesInput } from "@codesandbox/sandpack-client";
import { SandpackFS } from "@codesandbox/sandpack-client";
import {
  addPackageJSONIfNeededToMap,
  normalizePath,
} from "@codesandbox/sandpack-client/utils";

import { SANDBOX_TEMPLATES } from "../templates";
import type {
  SandboxEnvironment,
  SandpackFiles,
  SandpackPredefinedTemplate,
  SandpackSetup,
} from "../types";
import { BoundContext } from "@zenfs/core";

export interface SandboxTemplate {
  files: SandpackFilesInput;
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
  entry?: string;
  main: string;
  environment: SandboxEnvironment;
  mode?: string;
}

export interface CreateSandpackFSOptions {
  template?: SandpackPredefinedTemplate;
  customSetup?: SandpackSetup;
  files?: SandpackFiles;
}

/**
 * Normalize a mixed `SandpackFiles` (strings or objects) into the
 * `{code, ...meta}` shape consumed by {@link SandpackFS.fromFiles}.
 */
const normalizeFiles = (files?: SandpackFiles): SandpackFilesInput => {
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

const combineTemplateFiles = ({
  files,
  template,
  customSetup,
}: CreateSandpackFSOptions): SandboxTemplate => {
  const normalizedFiles = normalizePath(files) ?? {};
  const normalizedFilesInput = normalizeFiles(normalizedFiles as SandpackFiles);

  if (!template) {
    if (!customSetup) {
      const defaultTemplate =
        SANDBOX_TEMPLATES.vanilla as unknown as SandboxTemplate;
      return {
        ...defaultTemplate,
        files: { ...defaultTemplate.files, ...normalizedFilesInput },
      };
    }

    if (!files || Object.keys(files).length === 0) {
      throw new Error(
        `[sandpack-react]: without a template, you must pass at least one file`,
      );
    }

    return {
      ...(customSetup as Partial<SandboxTemplate>),
      files: normalizedFilesInput,
      main: Object.keys(normalizedFilesInput)[0] ?? "/index.js",
      environment: customSetup.environment ?? "parcel",
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
    files: normalizeFiles({
      ...(baseTemplate.files as unknown as SandpackFiles),
      ...(files ?? {}),
    }),
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
    mode: (baseTemplate as { mode?: string }).mode,
  } as SandboxTemplate;
};

/**
 * Resolve a file path against a file map, trying various JS extensions.
 * Returns the normalized path if found, or null.
 */
export const resolveFile = (
  path: string,
  files: Record<string, unknown>,
): string | null => {
  const normalizedFiles = normalizePath(files);
  const normalizedPath = normalizePath(path);

  if (normalizedPath in normalizedFiles) return normalizedPath;
  if (!path) return null;

  let resolvedPath: string | null = null;
  let index = 0;
  const strategies = [".js", ".jsx", ".ts", ".tsx"];

  while (!resolvedPath && index < strategies.length) {
    const removeExtension = normalizedPath.split(".")[0];
    const attemptPath = `${removeExtension}${strategies[index]}`;
    if (normalizedFiles[attemptPath] !== undefined) {
      resolvedPath = attemptPath;
    }
    index++;
  }

  return resolvedPath;
};

export const createSandpackFromFS = (
  fsContext: BoundContext,
  remotePortFactory: () => Promise<MessagePort>
): Promise<SandpackFS> => {
  return SandpackFS.fromFileSystemContext(fsContext, remotePortFactory);
}

/**
 * Build a fully-initialized {@link SandpackFS} from the JS-object convenience
 * inputs (template, customSetup, files). Consumers call this once and pass the
 * result as the `fs` prop to `SandpackProvider`.
 */
export const createSandpackFS = async (
  options: CreateSandpackFSOptions = {},
): Promise<SandpackFS> => {
  const projectSetup = combineTemplateFiles(options);

  const { files: rawFiles, entry } = projectSetup;

  const files = addPackageJSONIfNeededToMap(
    rawFiles,
    projectSetup.dependencies ?? {},
    projectSetup.devDependencies ?? {},
    entry ?? projectSetup.main,
  );

  return SandpackFS.fromFiles(files, {
    environment: projectSetup.environment,
    mode: projectSetup.mode,
  });
};
