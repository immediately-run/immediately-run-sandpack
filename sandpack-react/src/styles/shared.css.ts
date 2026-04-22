import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { vars } from "./vars.css";

export const iconStandaloneClassName = style({});
globalStyle(`.${iconStandaloneClassName} svg`, { margin: "auto" });

export const buttonClassName = style({
  appearance: "none",
  outline: "none",
  display: "flex",
  alignItems: "center",
  fontSize: "inherit",
  fontFamily: "inherit",
  backgroundColor: "transparent",
  transition: `color ${vars.transitions.default}, background ${vars.transitions.default}`,
  cursor: "pointer",
  color: vars.colors.clickable,
  border: 0,
  textDecoration: "none",

  selectors: {
    "&:disabled": { color: vars.colors.disabled },
    "&:hover:not(:disabled,[data-active='true'])": { color: vars.colors.hover },
    '&[data-active="true"]': { color: vars.colors.accent },

    [`&.${iconStandaloneClassName}`]: {
      padding: vars.space[1],
      height: vars.space[7],
      display: "flex",
    },

    // If there's a children besides the icon
    [`&.${iconStandaloneClassName}&:not(:has(span))`]: {
      width: vars.space[7],
    },

    [`&.${iconStandaloneClassName}&:has(svg + span)`]: {
      paddingRight: vars.space[3],
      paddingLeft: vars.space[2],
      gap: vars.space[1],
    },
  },
});

globalStyle(`.${buttonClassName} svg`, {
  minWidth: vars.space[4],
  width: vars.space[4],
  height: vars.space[4],
});

export const roundedButtonClassName = style({
  backgroundColor: vars.colors.surface2,
  borderRadius: "99999px",
  border: `1px solid ${vars.colors.surface3}`,

  selectors: {
    '&[data-active="true"]': {
      color: vars.colors.surface1,
      background: vars.colors.accent,
    },
    "&:hover:not(:disabled,[data-active='true'])": {
      backgroundColor: vars.colors.surface3,
    },
  },
});

export const iconClassName = style({ padding: 0 });

export const fadeIn = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

export const absoluteClassName = style({
  position: "absolute",
  bottom: "0",
  left: "0",
  right: "0",
  top: "0",
  margin: "0",
  overflow: "auto",
  height: "100%",
  zIndex: vars.zIndices.top,
});

const errorBaseClassName = style({
  whiteSpace: "pre-wrap",
  padding: vars.space[10],
  backgroundColor: vars.colors.surface1,
  display: "flex",
  gap: vars.space[2],
  flexDirection: "column",
});

globalStyle(`.${errorBaseClassName} .${buttonClassName}`, {
  width: "auto",
  gap: vars.space[2],
  padding: `0 ${vars.space[3]} 0 ${vars.space[2]}`,
  marginTop: vars.space[1],
});

export const errorClassName = recipe({
  base: errorBaseClassName,
  variants: {
    solidBg: {
      true: {
        backgroundColor: vars.colors.errorSurface,
      },
    },
  },
});

export const errorBundlerClassName = style({
  padding: vars.space[10],
  backgroundColor: vars.colors.surface1,
});

globalStyle(`.${errorBundlerClassName} .${buttonClassName}`, {
  marginTop: vars.space[6],
  width: "auto",
  gap: vars.space[2],
  padding: `0 ${vars.space[3]} 0 ${vars.space[2]}`,
});

const errorMessageBaseClassName = style({
  animation: `${fadeIn} 150ms ease`,
  color: vars.colors.error,
  display: "flex",
  flexDirection: "column",
  gap: vars.space[3],
});

globalStyle(`.${errorMessageBaseClassName} a`, { color: "inherit" });
globalStyle(`.${errorMessageBaseClassName} p`, { margin: 0 });

export const errorMessageClassName = recipe({
  base: errorMessageBaseClassName,
  variants: {
    errorCode: {
      true: { fontFamily: vars.font.mono },
    },
  },
});
