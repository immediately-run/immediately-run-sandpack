import { style } from "@vanilla-extract/css";

import { vars } from "../../styles/vars.css";

export const runButtonClassName = style({
  position: "absolute",
  bottom: vars.space[2],
  right: vars.space[2],
  paddingRight: vars.space[3],
});
