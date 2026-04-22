import { style } from "@vanilla-extract/css";

import { vars } from "../../styles/vars.css";

export const fileContainer = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginBottom: vars.space[2],
});

export const gapBottomClassName = style({
  marginBottom: vars.space[2],
});

export const failTestClassName = style({
  fontWeight: "bold",
});

export const labelClassName = style({
  borderRadius: `calc(${vars.border.radius} / 2)`,
});

export const specLabelClassName = style({
  padding: `${vars.space[1]} ${vars.space[2]}`,
  fontFamily: vars.font.mono,
  textTransform: "uppercase",
  marginRight: vars.space[2],
});

export const filePathButtonClassName = style({
  fontFamily: vars.font.mono,
  cursor: "pointer",
  display: "inline-block",
});

export const filePathClassName = style({
  color: vars.colors.clickable,
  textDecorationStyle: "dotted",
  textDecorationLine: "underline",
});

export const fileNameClassName = style({
  color: vars.colors.hover,
  fontWeight: "bold",
  textDecorationStyle: "dotted",
  textDecorationLine: "underline",
});
