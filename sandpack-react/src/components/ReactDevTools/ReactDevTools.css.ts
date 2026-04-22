import { style } from "@vanilla-extract/css";

import { vars } from "../../styles/vars.css";

export const devToolClassName = style({
  height: vars.layout.height,
  width: "100%",
});
