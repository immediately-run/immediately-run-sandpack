import { style } from "@vanilla-extract/css";

import { vars } from "../../styles/vars.css";

export const navigatorClassName = style({
  display: "flex",
  alignItems: "center",
  height: vars.layout.headerHeight,
  borderBottom: `1px solid ${vars.colors.surface2}`,
  padding: `${vars.space[3]} ${vars.space[2]}`,
  background: vars.colors.surface1,
});

export const inputClassName = style({
  backgroundColor: vars.colors.surface2,
  color: vars.colors.clickable,
  padding: `${vars.space[1]} ${vars.space[3]}`,
  borderRadius: "99999px",
  border: `1px solid ${vars.colors.surface2}`,
  height: "24px",
  lineHeight: "24px",
  fontSize: "inherit",
  outline: "none",
  flex: 1,
  marginLeft: vars.space[4],
  width: "0",
  transition: `background ${vars.transitions.default}`,

  selectors: {
    "&:hover": {
      backgroundColor: vars.colors.surface3,
    },
    "&:focus": {
      backgroundColor: vars.colors.surface1,
      border: `1px solid ${vars.colors.accent}`,
      color: vars.colors.base,
    },
  },
});

export const navigatorButtonClassName = style({
  minWidth: vars.space[6],
  justifyContent: "center",
});
