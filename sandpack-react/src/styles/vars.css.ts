import { createGlobalThemeContract } from "@vanilla-extract/css";

import { THEME_PREFIX } from "./constants";

const SYNTAX_TOKENS = [
  "plain",
  "comment",
  "keyword",
  "definition",
  "punctuation",
  "property",
  "tag",
  "static",
  "string",
] as const;

type SyntaxToken = (typeof SYNTAX_TOKENS)[number];
type SyntaxContract = Record<SyntaxToken, { color: string; fontStyle: string }>;

const syntaxContractShape = SYNTAX_TOKENS.reduce((acc, token) => {
  acc[token] = {
    color: `syntax-color-${token}`,
    fontStyle: `syntax-fontStyle-${token}`,
  };
  return acc;
}, {} as SyntaxContract);

const SPACE_KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
] as const;

type SpaceKey = (typeof SPACE_KEYS)[number];
type SpaceContract = Record<SpaceKey, string>;

const spaceContractShape = SPACE_KEYS.reduce((acc, key) => {
  acc[key] = `space-${key}`;
  return acc;
}, {} as SpaceContract);

/**
 * Token contract used by every `*.css.ts` style module.
 *
 * The leaf string values are the suffixes of the generated CSS variable names;
 * the `getName` callback prepends the `sp-` (THEME_PREFIX) so the produced var
 * names match the existing public CSS variable convention (e.g. CodeMirror
 * theme references `var(--sp-colors-surface1)`).
 */
export const vars = createGlobalThemeContract(
  {
    colors: {
      surface1: "colors-surface1",
      surface2: "colors-surface2",
      surface3: "colors-surface3",
      disabled: "colors-disabled",
      base: "colors-base",
      clickable: "colors-clickable",
      hover: "colors-hover",
      accent: "colors-accent",
      error: "colors-error",
      errorSurface: "colors-errorSurface",
      warning: "colors-warning",
      warningSurface: "colors-warningSurface",
    },
    syntax: syntaxContractShape,
    font: {
      body: "font-body",
      mono: "font-mono",
      size: "font-size",
      lineHeight: "font-lineHeight",
    },
    space: spaceContractShape,
    border: {
      radius: "border-radius",
    },
    layout: {
      height: "layout-height",
      headerHeight: "layout-headerHeight",
    },
    transitions: {
      default: "transitions-default",
    },
    zIndices: {
      base: "zIndices-base",
      overlay: "zIndices-overlay",
      top: "zIndices-top",
    },
  },
  (value) => `${THEME_PREFIX}-${value}`,
);

export type SandpackVarsContract = typeof vars;
