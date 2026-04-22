import { style } from "@vanilla-extract/css";

import { THEME_PREFIX } from "../../styles/constants";
import { vars } from "../../styles/vars.css";

export const stackClassName = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  position: "relative",
  backgroundColor: vars.colors.surface1,
  gap: 1,

  selectors: {
    [`&:has(.${THEME_PREFIX}-stack)`]: {
      backgroundColor: vars.colors.surface2,
    },
  },
});
