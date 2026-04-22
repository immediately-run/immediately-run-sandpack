import { defaultLight, defaultDark, SANDPACK_THEMES } from "../themes";
import type { SandpackTheme, SandpackThemeProp } from "../types";
import { isDarkColor } from "../utils/stringUtils";

import { THEME_PREFIX } from "./constants";
import { vars } from "./vars.css";
import type { SandpackVarsContract } from "./vars.css";

export { THEME_PREFIX };
export { vars };
export type { SandpackVarsContract };

const defaultVariables = {
  space: new Array(11).fill(" ").reduce((acc, _, index) => {
    return { ...acc, [index + 1]: `${(index + 1) * 4}px` };
  }, {}),
  border: { radius: "4px" },
  layout: { height: "300px", headerHeight: "40px" },
  transitions: { default: "150ms ease" },
  zIndices: {
    base: "1",
    overlay: "2",
    top: "3",
  },
};

/**
 * Flatten a `SandpackTheme` into the same `{ colors, syntax, font, ... }`
 * record shape that the Stitches integration historically produced.
 *
 * Kept exported (under its old name as well) for backwards compatibility with
 * downstream snapshot tests and consumers that reach into this internal helper.
 *
 * @category Theme
 */
export const standardizeThemeTokens = (
  theme: SandpackTheme,
): Record<string, Record<string, string>> => {
  const syntaxEntries = Object.entries(theme.syntax);
  const syntax = syntaxEntries.reduce((tokenAcc, [tokenName, tokenValue]) => {
    let newValues: Record<string, string> = {
      [`color-${tokenName}`]: tokenValue as string,
    };

    if (typeof tokenValue === "object") {
      newValues = Object.entries(tokenValue).reduce(
        (valueAcc, [styleProp, styleValue]) => {
          return {
            ...valueAcc,
            [`${styleProp}-${tokenName}`]: styleValue as string,
          };
        },
        {} as Record<string, string>,
      );
    }

    return { ...tokenAcc, ...newValues };
  }, {});

  return {
    ...defaultVariables,
    colors: theme.colors as Record<string, string>,
    font: theme.font as unknown as Record<string, string>,
    syntax,
  };
};

/**
 * @deprecated Use `standardizeThemeTokens` instead — kept for backwards
 *   compatibility with consumers that imported the old Stitches-flavoured name.
 */
export const standardizeStitchesTheme = standardizeThemeTokens;

/**
 * Convert a flat token object produced by `standardizeThemeTokens` into the
 * nested shape expected by `assignInlineVars(vars, ...)`.
 *
 * The two big differences vs. the flat record are:
 * - syntax values are nested under `{ color, fontStyle }` to match the contract
 *   in `vars.css.ts`;
 * - missing optional values (e.g. `fontStyle` for syntax tokens that are plain
 *   colour strings) are filled with empty strings so vanilla-extract is happy.
 */
export const themeVars = (
  theme: SandpackTheme,
): {
  colors: Record<string, string>;
  syntax: Record<string, { color: string; fontStyle: string }>;
  font: Record<string, string>;
  space: Record<string, string>;
  border: { radius: string };
  layout: { height: string; headerHeight: string };
  transitions: { default: string };
  zIndices: { base: string; overlay: string; top: string };
} => {
  const flat = standardizeThemeTokens(theme);

  const syntaxNested: Record<string, { color: string; fontStyle: string }> = {};
  Object.entries(flat.syntax).forEach(([key, value]) => {
    const dashIndex = key.indexOf("-");
    if (dashIndex === -1) return;
    const prop = key.slice(0, dashIndex);
    const token = key.slice(dashIndex + 1);
    if (!syntaxNested[token]) {
      syntaxNested[token] = { color: "", fontStyle: "" };
    }
    if (prop === "color" || prop === "fontStyle") {
      syntaxNested[token][prop] = value;
    }
  });

  return {
    colors: flat.colors,
    syntax: syntaxNested,
    font: flat.font,
    space: flat.space,
    border: flat.border as { radius: string },
    layout: flat.layout as { height: string; headerHeight: string },
    transitions: flat.transitions as { default: string },
    zIndices: flat.zIndices as {
      base: string;
      overlay: string;
      top: string;
    },
  };
};

/**
 * @category Theme
 */
export const standardizeTheme = (
  inputTheme: SandpackThemeProp = "light",
): { id: string; theme: SandpackTheme; mode: "dark" | "light" } => {
  const defaultLightThemeKey = "default";

  if (typeof inputTheme === "string") {
    const predefinedTheme = SANDPACK_THEMES[inputTheme];
    if (!predefinedTheme) {
      throw new Error(
        `[sandpack-react]: invalid theme '${inputTheme}' provided.`,
      );
    }

    return {
      theme: predefinedTheme,
      id: inputTheme,
      mode: isDarkColor(predefinedTheme.colors.surface1) ? "dark" : "light",
    };
  }

  const mode = isDarkColor(
    inputTheme?.colors?.surface1 ?? defaultLight.colors.surface1,
  )
    ? "dark"
    : "light";

  const baseTheme = mode === "dark" ? defaultDark : defaultLight;
  const colorsByMode = { ...baseTheme.colors, ...(inputTheme?.colors ?? {}) };
  const syntaxByMode = { ...baseTheme.syntax, ...(inputTheme?.syntax ?? {}) };
  const fontByMode = { ...baseTheme.font, ...(inputTheme?.font ?? {}) };

  const theme = {
    colors: colorsByMode,
    syntax: syntaxByMode,
    font: fontByMode,
  };

  const id = inputTheme
    ? simpleHashFunction(JSON.stringify(theme))
    : defaultLightThemeKey;

  return {
    theme,
    id: `sp-${id}`,
    mode,
  };
};

const simpleHashFunction = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; hash &= hash) {
    hash = 31 * hash + str.charCodeAt(i++);
  }
  return Math.abs(hash);
};
