import { style } from "@vanilla-extract/css";

import { vars } from "../../styles/vars.css";

export const fileExplorerClassName = style({
  padding: vars.space[3],
  overflow: "auto",
  height: "100%",
});
