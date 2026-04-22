import { globalStyle } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "./vars.css";

/**
 * Wrapper element styles for `<SandpackThemeProvider>`.
 *
 * The `variant` recipe sets `color-scheme` so native form controls and
 * scrollbars match the active theme.
 */
export const wrapperClassName = recipe({
  base: {
    all: "initial",
    fontSize: vars.font.size,
    fontFamily: vars.font.body,
    display: "block",
    boxSizing: "border-box",
    textRendering: "optimizeLegibility",
    WebkitTapHighlightColor: "transparent",
    WebkitFontSmoothing: "subpixel-antialiased",

    "@media": {
      "screen and (min-resolution: 2dppx)": {
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
    },

    selectors: {
      "&.sp-wrapper:focus": { outline: "0" },
    },
  },
  variants: {
    variant: {
      dark: { colorScheme: "dark" },
      light: { colorScheme: "light" },
    },
  },
});

globalStyle(".sp-wrapper *", { boxSizing: "border-box" });
