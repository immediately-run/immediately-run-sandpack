import { globalStyle, style } from "@vanilla-extract/css";

import { fadeIn } from "../../styles/shared.css";
import { vars } from "../../styles/vars.css";

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
