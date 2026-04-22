import { createTheme, createThemeContract } from "@vanilla-extract/css";

import { palette } from "./palette";
import { fontFamilies, fontWeights } from "./typography";

/**
 * Theme contract for the landing site.
 *
 * Tokens previously lived in `stitches.config.ts`; the names are kept
 * identical so call sites can swap `"$primary"` strings for
 * `vars.colors.primary` references.
 */
export const vars = createThemeContract({
  colors: {
    primary: null,
    secondary: null,
    darkTextPrimary: null,
    darkTextSecondary: null,
    darkBackground: null,
    lightTextPrimary: null,
    lightTextSecondary: null,
    lightBackground: null,
    surface: null,
  },
  fontWeights: {
    normal: null,
    semiBold: null,
  },
  fonts: {
    base: null,
    mono: null,
  },
  transitions: {
    default: null,
  },
});

/**
 * Default (dark-mode) theme, applied on a top-level wrapper.
 *
 * Stitches exposed `theme.colors.primary`, `theme.fonts.base`, etc. directly,
 * and we mirror the same shape so component refactors are mechanical.
 */
export const themeClass = createTheme(vars, {
  colors: {
    primary: palette.primary,
    secondary: palette.secondary,
    darkTextPrimary: palette.darkTextPrimary,
    darkTextSecondary: palette.darkTextSecondary,
    darkBackground: palette.darkBackground,
    lightTextPrimary: palette.lightTextPrimary,
    lightTextSecondary: palette.lightTextSecondary,
    lightBackground: palette.lightBackground,
    surface: palette.surface,
  },
  fontWeights: {
    normal: String(fontWeights.normal),
    semiBold: String(fontWeights.semiBold),
  },
  fonts: {
    base: fontFamilies.base,
    mono: fontFamilies.mono,
  },
  transitions: {
    default: "all .2s ease",
  },
});
