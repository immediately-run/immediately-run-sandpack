import { globalFontFace, globalStyle } from "@vanilla-extract/css";

import { baseFont, fontWeights, monoFont } from "./typography";
import { vars } from "./vars.css";

globalFontFace(baseFont, [
  {
    fontWeight: String(fontWeights.normal),
    src: `url("/assets/fonts/Inter-Regular.woff") format("woff")`,
    fontDisplay: "swap",
  },
  {
    fontWeight: String(fontWeights.semiBold),
    src: `url("/assets/fonts/Inter-SemiBold.woff") format("woff")`,
    fontDisplay: "swap",
  },
]);

globalFontFace(monoFont, {
  src: `url("/assets/fonts/FiraCode-Regular.woff") format("woff")`,
  fontDisplay: "swap",
});

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
  WebkitFontSmoothing: "antialiased",
});

globalStyle("html, body", {
  backgroundColor: vars.colors.darkBackground,
  color: vars.colors.darkTextPrimary,
  height: "100%",
});

globalStyle("html", {
  fontSize: "10px",
});

globalStyle("body", {
  fontSize: "1.6rem",
  lineHeight: 1.6,
  letterSpacing: "-0.025em",
  fontFamily: vars.fonts.base,
  margin: 0,
  overflowX: "hidden",
});

globalStyle("::selection", {
  backgroundColor: vars.colors.primary,
  color: vars.colors.lightTextPrimary,
});

globalStyle("a, a:visited", {
  color: "inherit",
  textDecoration: "none",
});

globalStyle("code", {
  fontFamily: vars.fonts.mono,
});

globalStyle(".sp-wrapper *::-webkit-scrollbar", {
  width: "8px",
  height: "8px",
  opacity: 0,
  display: "none",
  transition: "opacity 0.1s ease",
});

globalStyle(".sp-wrapper *:hover::-webkit-scrollbar", {
  display: "block",
  opacity: 1,
});

globalStyle(".sp-wrapper *::-webkit-scrollbar-track", {
  backgroundColor: "var(--sp-colors-bg-default)",
  boxShadow: "none",
  borderLeft: "1px solid var(--sp-colors-fg-inactive)",
});

globalStyle(".sp-wrapper *::-webkit-scrollbar-corner", {
  backgroundColor: "transparent",
});

globalStyle(".sp-wrapper *::-webkit-scrollbar-thumb", {
  backgroundColor: "var(--sp-colors-fg-default)",
  borderRadius: "9999px",
  opacity: 0,
});

globalStyle(".sp-wrapper *::-webkit-scrollbar-thumb:hover", {
  opacity: 1,
});
