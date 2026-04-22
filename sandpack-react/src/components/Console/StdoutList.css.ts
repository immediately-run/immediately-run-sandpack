import { style } from "@vanilla-extract/css";

import { vars } from "../../styles/vars.css";

export const consoleItemClassName = style({
  width: "100%",
  padding: `${vars.space[3]} ${vars.space[2]}`,
  fontSize: ".85em",
  position: "relative",
  whiteSpace: "pre",

  selectors: {
    "&:not(:first-child):after": {
      content: "",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      background: vars.colors.surface3,
    },
  },
});
