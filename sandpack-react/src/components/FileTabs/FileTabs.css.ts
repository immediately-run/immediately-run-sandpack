import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../../styles/vars.css";

export const tabsClassName = style({
  borderBottom: `1px solid ${vars.colors.surface2}`,
  background: vars.colors.surface1,
});

export const tabsScrollableClassName = style({
  padding: `0 ${vars.space[2]}`,
  overflow: "auto",
  display: "flex",
  flexWrap: "nowrap",
  alignItems: "stretch",
  minHeight: "40px",
  marginBottom: "-1px",
});

export const closeButtonClassName = style({
  padding: `0 ${vars.space[1]} 0 ${vars.space[1]}`,
  borderRadius: vars.border.radius,
  marginLeft: vars.space[1],
  width: vars.space[5],
  visibility: "hidden",
  cursor: "pointer",
  position: "absolute",
  right: "0px",
});

globalStyle(`.${closeButtonClassName} svg`, {
  width: vars.space[3],
  height: vars.space[3],
  display: "block",
  position: "relative",
  top: 1,
});

export const tabContainer = style({
  display: "flex",
  alignItems: "center",
  outline: "none",
  position: "relative",
  paddingRight: "20px",
  margin: "1px 0",

  selectors: {
    "&:has(button:focus)": {
      outline: `${vars.colors.accent} auto 1px`,
    },
  },
});

export const tabButton = style({
  padding: `0 ${vars.space[2]}`,
  height: vars.layout.headerHeight,
  whiteSpace: "nowrap",

  selectors: {
    "&:focus": {
      outline: "none",
    },
  },
});

globalStyle(`.${tabButton}:hover ~ .${closeButtonClassName}`, {
  visibility: "visible",
});
