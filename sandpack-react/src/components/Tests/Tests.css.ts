import { style } from "@vanilla-extract/css";

import { vars } from "../../styles/vars.css";

export const testContainerClassName = style({
  marginLeft: vars.space[4],
});

export const containerClassName = style({
  marginBottom: vars.space[2],
  color: vars.colors.clickable,
});

export const testClassName = style({
  marginBottom: vars.space[2],
  color: vars.colors.hover,
});

export const durationClassName = style({
  marginLeft: vars.space[2],
});

export const gapRightClassName = style({
  marginRight: vars.space[2],
});
