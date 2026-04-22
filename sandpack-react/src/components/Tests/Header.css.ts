import { style } from "@vanilla-extract/css";

import { vars } from "../../styles/vars.css";

export const wrapperClassName = style({
  justifyContent: "space-between",
  borderBottom: `1px solid ${vars.colors.surface2}`,
  padding: `0 ${vars.space[2]}`,
  fontFamily: vars.font.mono,
  height: vars.layout.headerHeight,
  minHeight: vars.layout.headerHeight,
  overflowX: "auto",
  whiteSpace: "nowrap",
});

export const flexClassName = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: vars.space[2],
});

export const headerButtonClassName = style({
  padding: `${vars.space[1]} ${vars.space[3]}`,
});

export const headerTitleClassName = style({
  lineHeight: 1,
  margin: 0,
  color: vars.colors.base,
  fontSize: vars.font.size,
  display: "flex",
  alignItems: "center",
  gap: vars.space[2],
});
