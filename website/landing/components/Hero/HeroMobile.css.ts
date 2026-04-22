import { style } from "@vanilla-extract/css";

import { styleBlock } from "../../styles/convert"

export const heroSectionClassName = styleBlock({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "50px",
    height: "100%",
    minHeight: "100vh",
    padding: "100px 16px 0",
    overflow: "hidden",
    width: "100%",

    "@bp2": {
      background: "$surface",
    },
  });

export const heroLogoColumnClassName = style({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "40px",
});

export const heroLogoSizerClassName = styleBlock({
    width: "60px",
    "@bp1": { width: "100px" },
  });

export const heroTitleColumnClassName = style({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "20px",
});

export const heroTitleClassName = styleBlock({
    fontWeight: "$semiBold",
    fontSize: "36px",
    lineHeight: "100%",
    textAlign: "center",
    letterSpacing: "-0.05em",

    "@bp1": {
      fontSize: "72px",
    },
  });

export const heroSubtitleClassName = styleBlock({
    color: "$darkTextSecondary",
    fontSize: "16px",
    fontWeight: "$normal",
    lineHeight: "19px",
    letterSpacing: "-0.0125em",
    textAlign: "center",
    maxWidth: "320px",
  });

export const heroPreviewWrapperClassName = style({
  display: "flex",
  justifyContent: "center",
  width: "100%",
});
