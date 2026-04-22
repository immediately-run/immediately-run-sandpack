import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../../styles/vars.css";

export const explorerClassName = style({
  borderRadius: "0",
  width: "100%",
  padding: 0,
  marginBottom: vars.space[2],
});

globalStyle(`.${explorerClassName} span`, {
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
});

globalStyle(`.${explorerClassName} svg`, {
  marginRight: vars.space[1],
});
