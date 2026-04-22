import { globalStyle, style } from "@vanilla-extract/css";

import { THEME_PREFIX } from "../../styles/constants";
import { buttonClassName } from "../../styles/shared.css";
import { vars } from "../../styles/vars.css";

export const placeholderClassName = style({
  margin: "0",
  display: "block",
  fontFamily: vars.font.mono,
  fontSize: vars.font.size,
  color: vars.syntax.plain.color,
  lineHeight: vars.font.lineHeight,
});

const SYNTAX_HIGHLIGHT_TOKENS = [
  "string",
  "plain",
  "comment",
  "keyword",
  "definition",
  "punctuation",
  "property",
  "tag",
  "static",
] as const;

export const tokensClassName = style({});

SYNTAX_HIGHLIGHT_TOKENS.forEach((token) => {
  globalStyle(`.${tokensClassName} .${THEME_PREFIX}-syntax-${token}`, {
    color: vars.syntax[token].color,
    fontStyle: vars.syntax[token].fontStyle,
  });
});

export const editorClassName = style({
  flex: 1,
  position: "relative",
  overflow: "auto",
  background: vars.colors.surface1,

  "@media": {
    "screen and (max-width: 768px)": {
      "@supports": {
        "(-webkit-overflow-scrolling: touch)": {},
      },
    },
  },
});

globalStyle(`.${editorClassName} .cm-scroller`, {
  padding: `${vars.space[4]} 0`,
});
globalStyle(`.${editorClassName} .${placeholderClassName}`, {
  padding: `${vars.space[4]} 0`,
});

globalStyle(`.${editorClassName} .cm-content`, {
  "@media": {
    "screen and (max-width: 768px)": {
      "@supports": {
        "(-webkit-overflow-scrolling: touch)": {
          fontSize: "16px",
        },
      },
    },
  },
});

export const cmClassName = style({
  margin: "0",
  outline: "none",
  height: "100%",
});

export const readOnlyClassName = style({
  fontFamily: vars.font.mono,
  fontSize: "0.8em",
  position: "absolute",
  right: vars.space[2],
  bottom: vars.space[2],
  zIndex: vars.zIndices.top,
  color: vars.colors.clickable,
  backgroundColor: vars.colors.surface2,
  borderRadius: "99999px",
  padding: `calc(${vars.space[1]} / 2) ${vars.space[2]}`,
});

globalStyle(`.${readOnlyClassName} + .${buttonClassName}`, {
  right: `calc(${vars.space[11]} * 2)`,
});
