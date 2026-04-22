import { style } from "@vanilla-extract/css";

import { vars } from "../../styles/vars.css";

export const containerClassName = style({
  color: vars.colors.hover,
  fontSize: vars.font.size,
  padding: vars.space[2],
  whiteSpace: "pre-wrap",
});
