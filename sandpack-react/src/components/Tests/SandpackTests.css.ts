import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../../styles/vars.css";

export const previewActionsClassName = style({
  display: "flex",
  position: "absolute",
  bottom: vars.space[2],
  right: vars.space[2],
  zIndex: vars.zIndices.overlay,
});

globalStyle(`.${previewActionsClassName} > *`, {
  marginLeft: vars.space[2],
});

export const containerClassName = style({
  padding: vars.space[4],
  height: "100%",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  fontFamily: vars.font.mono,
});

export const fileErrorContainerClassName = style({
  fontWeight: "bold",
  color: vars.colors.base,
});
