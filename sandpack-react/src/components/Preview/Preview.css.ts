import { globalStyle, style } from "@vanilla-extract/css";

import { THEME_PREFIX } from "../../styles/constants";
import { vars } from "../../styles/vars.css";

export const previewClassName = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  background: "white",
  overflow: "auto",
  position: "relative",
});

globalStyle(`.${previewClassName} .${THEME_PREFIX}-bridge-frame`, {
  border: 0,
  position: "absolute",
  left: vars.space[2],
  bottom: vars.space[2],
  zIndex: vars.zIndices.top,
  height: 12,
  width: "30%",
  mixBlendMode: "multiply",
  pointerEvents: "none",
});

export const previewIframe = style({
  border: "0",
  outline: "0",
  width: "100%",
  height: "100%",
  minHeight: "160px",
  maxHeight: "2000px",
  flex: 1,
});

export const previewActionsClassName = style({
  display: "flex",
  position: "absolute",
  bottom: vars.space[2],
  right: vars.space[2],
  zIndex: vars.zIndices.overlay,
  gap: vars.space[2],
});
