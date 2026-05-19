import { globalStyle, style } from "@vanilla-extract/css";

import { THEME_PREFIX } from "../../styles/constants";
import { vars } from "../../styles/vars.css";

export const consoleWrapperClassName = style({
  height: "100%",
  background: vars.colors.surface1,
});

globalStyle(`.${consoleWrapperClassName} iframe`, { display: "none" });

globalStyle(`.${consoleWrapperClassName} .${THEME_PREFIX}-bridge-frame`, {
  display: "block",
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

export const consoleListClassName = style({
  overflow: "auto",
  scrollBehavior: "smooth",
});

export const consoleActionsClassName = style({
  position: "absolute",
  bottom: vars.space[2],
  right: vars.space[2],
  display: "flex",
  gap: vars.space[2],
});
