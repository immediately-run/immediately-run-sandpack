import { globalStyle, style } from "@vanilla-extract/css";

import { THEME_PREFIX } from "../../styles/constants";

export const transpiledCodeClassName = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  position: "relative",
  overflow: "auto",
  minHeight: "160px",
  flex: 1,
});

globalStyle(`.${transpiledCodeClassName} .${THEME_PREFIX}-stack`, {
  height: "100%",
});
