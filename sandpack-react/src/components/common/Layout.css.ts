import { globalStyle, style } from "@vanilla-extract/css";

import { THEME_PREFIX } from "../../styles/constants";
import { vars } from "../../styles/vars.css";

import { stackClassName } from "./Stack.css";

export const layoutClassName = style({
  border: `1px solid ${vars.colors.surface2}`,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "stretch",
  borderRadius: vars.border.radius,
  overflow: "hidden",
  position: "relative",
  backgroundColor: vars.colors.surface2,
  gap: 1,
});

globalStyle(`.${layoutClassName} > .${stackClassName}`, {
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: "0",
  height: vars.layout.height,
  overflow: "hidden",
});

globalStyle(`.${layoutClassName} > .${THEME_PREFIX}-file-explorer`, {
  flex: 0.2,
  minWidth: 200,
});

globalStyle(`.${layoutClassName} > .${stackClassName}`, {
  "@media": {
    print: {
      height: "auto",
      display: "block",
    },
    "screen and (max-width: 768px)": {
      minWidth: "100%",
    },
  },
});

globalStyle(
  `.${layoutClassName} > .${stackClassName}:not(.${THEME_PREFIX}-preview, .${THEME_PREFIX}-editor, .${THEME_PREFIX}-preset-column)`,
  {
    "@media": {
      "screen and (max-width: 768px)": {
        height: `calc(${vars.layout.height} / 2)`,
      },
    },
  },
);

globalStyle(`.${layoutClassName} > .${THEME_PREFIX}-file-explorer`, {
  "@media": {
    "screen and (max-width: 768px)": {
      flex: 1,
    },
  },
});
