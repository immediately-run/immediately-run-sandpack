import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { THEME_PREFIX } from "../../styles/constants";
import { vars } from "../../styles/vars.css";

const consoleItemBaseClassName = style({
  width: "100%",
  padding: `${vars.space[3]} ${vars.space[2]}`,
  fontSize: ".8em",
  position: "relative",

  selectors: {
    "&:not(:first-child):after": {
      content: "",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      background: vars.colors.surface3,
    },
  },
});

globalStyle(`.${consoleItemBaseClassName} .sp-cm`, {
  padding: 0,
});
globalStyle(`.${consoleItemBaseClassName} .cm-editor`, {
  background: "none",
});
globalStyle(`.${consoleItemBaseClassName} .cm-content`, {
  padding: 0,
});
globalStyle(
  `.${consoleItemBaseClassName} .${THEME_PREFIX}-pre-placeholder`,
  {
    margin: "0 !important",
    fontSize: "1em",
  },
);

export const consoleItemClassName = recipe({
  base: consoleItemBaseClassName,
  variants: {
    variant: {
      error: {
        color: vars.colors.error,
        background: vars.colors.errorSurface,

        selectors: {
          "&:not(:first-child):after": {
            background: vars.colors.error,
            opacity: 0.07,
          },
        },
      },
      warning: {
        color: vars.colors.warning,
        background: vars.colors.warningSurface,

        selectors: {
          "&:not(:first-child):after": {
            background: vars.colors.warning,
            opacity: 0.07,
          },
        },
      },
      clear: {
        fontStyle: "italic",
      },
      info: {},
    },
  },
});
