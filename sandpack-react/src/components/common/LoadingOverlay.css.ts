import { globalStyle, style } from "@vanilla-extract/css";

import { fadeIn } from "../../styles/shared.css";
import { vars } from "../../styles/vars.css";

export const loadingClassName = style({
  backgroundColor: vars.colors.surface1,
});

export const errorTitleClassName = style({
  fontWeight: "bold",
});

export const stdoutPreview = style({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: vars.space[8],
  overflow: "auto",
  opacity: 0.5,
  overflowX: "hidden",
});

export const progressClassName = style({
  position: "absolute",
  left: vars.space[5],
  bottom: vars.space[4],
  zIndex: vars.zIndices.top,
  color: vars.colors.clickable,
  animation: `${fadeIn} 150ms ease`,
  fontFamily: vars.font.mono,
  fontSize: ".8em",
  width: "75%",
});

globalStyle(`.${progressClassName} p`, {
  whiteSpace: "nowrap",
  margin: 0,
  textOverflow: "ellipsis",
  overflow: "hidden",
});
