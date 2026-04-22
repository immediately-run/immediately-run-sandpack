import { style } from "@vanilla-extract/css";

import { vars } from "../../styles/vars.css";

export const gapBottomClassName = style({
  marginBottom: vars.space[2],
});

export const labelClassName = style({
  fontWeight: "bold",
  color: vars.colors.hover,
  whiteSpace: "pre-wrap",
});

export const containerClassName = style({
  fontWeight: "bold",
  color: vars.colors.clickable,
});
