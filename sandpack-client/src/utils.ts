import { invariant } from "outvariant";

import type { SandpackFS, SandpackFilesInput } from "./fs/SandpackFS";
import type {
  Dependencies,
  SandpackErrorMessage,
  SandpackError,
  ErrorStackFrame,
} from "./types";

export const createError = (message: string): string =>
  `[sandpack-client]: ${message}`;

export function nullthrows<T>(value?: T | null, err = "Value is nullish"): T {
  invariant(value != null, createError(err));

  return value;
}

const DEPENDENCY_ERROR_MESSAGE = `"dependencies" was not specified - provide either a package.json or a "dependencies" value`;
const ENTRY_ERROR_MESSAGE = `"entry" was not specified - provide either a package.json with the "main" field or an "entry" value`;

export function createPackageJSON(
  dependencies: Dependencies = {},
  devDependencies: Dependencies = {},
  entry = "/index.js",
): string {
  return JSON.stringify(
    {
      name: "sandpack-project",
      main: entry,
      dependencies,
      devDependencies,
    },
    null,
    2,
  );
}

/**
 * Ensures a `/package.json` exists inside the given {@link SandpackFS}, merging
 * any supplied dependency / entry overrides. Mutates the filesystem in place.
 */
export async function addPackageJSONIfNeeded(
  fs: SandpackFS,
  dependencies?: Dependencies,
  devDependencies?: Dependencies,
  entry?: string,
): Promise<void> {
  const hasPkg = await fs.exists("/package.json");

  if (!hasPkg) {
    nullthrows(dependencies, DEPENDENCY_ERROR_MESSAGE);
    nullthrows(entry, ENTRY_ERROR_MESSAGE);

    await fs.writeFile(
      "/package.json",
      createPackageJSON(dependencies, devDependencies, entry),
    );
    return;
  }

  const existing = await fs.readFile("/package.json");
  const packageJsonContent = JSON.parse(existing);
  // This runs on every register-frame handshake. Only write the file back if
  // the merge below actually changed something: an unconditional rewrite fires
  // the shared filesystem's change watcher, which relays an `fs-change` to the
  // bundler right after it booted — forcing a reload whose handshake rewrites
  // package.json again, i.e. an infinite reload loop.
  const beforeMerge = JSON.stringify(packageJsonContent);

  if (!dependencies && !packageJsonContent.dependencies) {
    throw new Error(createError(ENTRY_ERROR_MESSAGE));
  }

  if (dependencies) {
    packageJsonContent.dependencies = {
      ...(packageJsonContent.dependencies ?? {}),
      ...dependencies,
    };
  }

  if (devDependencies) {
    packageJsonContent.devDependencies = {
      ...(packageJsonContent.devDependencies ?? {}),
      ...devDependencies,
    };
  }

  if (entry) {
    packageJsonContent.main = entry;
  }

  if (JSON.stringify(packageJsonContent) === beforeMerge) {
    return;
  }

  await fs.writeFile(
    "/package.json",
    JSON.stringify(packageJsonContent, null, 2),
  );
}

/**
 * Sync variant of {@link addPackageJSONIfNeeded} that operates on a plain
 * {@link SandpackFilesInput} map (pre-filesystem). Useful in pure planners
 * like `getSandpackStateFromProps` so callers can decide what to seed the
 * filesystem with before any I/O happens.
 */
export function addPackageJSONIfNeededToMap(
  files: SandpackFilesInput,
  dependencies?: Dependencies,
  devDependencies?: Dependencies,
  entry?: string,
): SandpackFilesInput {
  const next: SandpackFilesInput = { ...files };

  if (!next["/package.json"]) {
    nullthrows(dependencies, DEPENDENCY_ERROR_MESSAGE);
    nullthrows(entry, ENTRY_ERROR_MESSAGE);

    next["/package.json"] = {
      code: createPackageJSON(dependencies, devDependencies, entry),
    };
    return next;
  }

  const pkg = JSON.parse(next["/package.json"].code);

  if (!dependencies && !pkg.dependencies) {
    throw new Error(createError(ENTRY_ERROR_MESSAGE));
  }

  if (dependencies) {
    pkg.dependencies = { ...(pkg.dependencies ?? {}), ...dependencies };
  }
  if (devDependencies) {
    pkg.devDependencies = {
      ...(pkg.devDependencies ?? {}),
      ...devDependencies,
    };
  }
  if (entry) {
    pkg.main = entry;
  }

  next["/package.json"] = { code: JSON.stringify(pkg, null, 2) };
  return next;
}

export function extractErrorDetails(msg: SandpackErrorMessage): SandpackError {
  if (msg.title === "SyntaxError") {
    const { title, path, message, line, column } = msg;
    return { title, path, message, line, column };
  }

  const relevantStackFrame = getRelevantStackFrame(msg.payload?.frames);
  if (!relevantStackFrame) {
    return { message: msg.message };
  }

  const errorInCode = getErrorInOriginalCode(relevantStackFrame);
  const errorLocation = getErrorLocation(relevantStackFrame);
  const errorMessage = formatErrorMessage(
    relevantStackFrame._originalFileName,
    msg.message,
    errorLocation,
    errorInCode,
  );

  return {
    message: errorMessage,
    title: msg.title,
    path: relevantStackFrame._originalFileName,
    line: relevantStackFrame._originalLineNumber,
    column: relevantStackFrame._originalColumnNumber,
  };
}

function getRelevantStackFrame(
  frames?: ErrorStackFrame[],
): ErrorStackFrame | undefined {
  if (!frames) {
    return;
  }

  return frames.find((frame) => !!frame._originalFileName);
}

function getErrorLocation(errorFrame: ErrorStackFrame): string {
  return errorFrame
    ? ` (${errorFrame._originalLineNumber}:${errorFrame._originalColumnNumber})`
    : ``;
}

function getErrorInOriginalCode(errorFrame: ErrorStackFrame): string {
  const lastScriptLine =
    errorFrame._originalScriptCode[errorFrame._originalScriptCode.length - 1];
  const numberOfLineNumberCharacters =
    lastScriptLine.lineNumber.toString().length;

  const leadingCharacterOffset = 2;
  const barSeparatorCharacterOffset = 3;
  const extraLineLeadingSpaces =
    leadingCharacterOffset +
    numberOfLineNumberCharacters +
    barSeparatorCharacterOffset +
    errorFrame._originalColumnNumber;

  return errorFrame._originalScriptCode.reduce((result, scriptLine) => {
    const leadingChar = scriptLine.highlight ? ">" : " ";
    const lineNumber =
      scriptLine.lineNumber.toString().length === numberOfLineNumberCharacters
        ? `${scriptLine.lineNumber}`
        : ` ${scriptLine.lineNumber}`;

    const extraLine = scriptLine.highlight
      ? "\n" + " ".repeat(extraLineLeadingSpaces) + "^"
      : "";

    return (
      result + // accumulator
      "\n" +
      leadingChar + // > or " "
      " " +
      lineNumber + // line number on equal number of characters
      " | " +
      scriptLine.content + // code
      extraLine // line under the highlighed line to show the column index
    );
  }, "");
}

function formatErrorMessage(
  filePath: string,
  message: string,
  location: string,
  errorInCode: string,
): string {
  return `${filePath}: ${message}${location}
${errorInCode}`;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const normalizePath = <R>(path: R): R => {
  if (typeof path === "string") {
    return (path.startsWith("/") ? path : `/${path}`) as R;
  }

  if (Array.isArray(path)) {
    return path.map((p) => (p.startsWith("/") ? p : `/${p}`)) as R;
  }

  if (typeof path === "object" && path !== null) {
    return Object.entries(path as any).reduce<any>(
      (acc, [key, content]: [string, string | any]) => {
        const fileName = key.startsWith("/") ? key : `/${key}`;

        acc[fileName] = content;

        return acc;
      },
      {},
    );
  }

  return null as R;
};
