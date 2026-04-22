import { style } from "@vanilla-extract/css";

import { vars } from "../../styles/vars.css";

export const nameClassName = style({
  color: vars.colors.hover,
  marginBottom: vars.space[2],
});

export const containerClassName = style({
  marginLeft: vars.space[4],
});
