import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../styles/vars.css";

export const dragHandler = recipe({
  base: {
    position: "absolute",
    zIndex: vars.zIndices.top,

    "@media": {
      "screen and (max-width: 768px)": {
        display: "none",
      },
    },
  },
  variants: {
    direction: {
      vertical: {
        right: 0,
        left: 0,
        height: 10,
        cursor: "ns-resize",
      },
      horizontal: {
        top: 0,
        bottom: 0,
        width: 10,
        cursor: "ew-resize",
      },
    },
  },
});

export const buttonCounter = style({
  position: "relative",
});

globalStyle(`.${buttonCounter} strong`, {
  background: vars.colors.clickable,
  color: vars.colors.surface1,
  minWidth: 12,
  height: 12,
  padding: "0 2px",
  borderRadius: 12,
  fontSize: 8,
  lineHeight: "12px",
  position: "absolute",
  top: 0,
  right: 0,
  fontWeight: "normal",
});

export const consoleWrapper = style({
  width: "100%",
  overflow: "hidden",
});

export const rtlLayoutClassName = style({
  flexDirection: "row-reverse",

  "@media": {
    "screen and (max-width: 768px)": {
      flexFlow: "wrap-reverse !important",
      flexDirection: "initial",
    },
  },
});
