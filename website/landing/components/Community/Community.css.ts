import { style } from "@vanilla-extract/css";

import { styleBlock } from "../../styles/convert"

export const dividerClassName = styleBlock({
    border: "1px solid $darkTextPrimary",
    margin: "20px 0px",
    width: "50px",

    "@bp2": {
      margin: "100px 0px",
    },
  });

export const titleClassName = styleBlock({
    fontFamily: "$base",
    fontSize: "24px",
    fontWeight: "$semiBold",
    letterSpacing: "-0.05em",
    lineHeight: "100%",
    margin: "0",
    textAlign: "center",

    "@bp1": {
      fontSize: "36px",
    },

    "@bp2": {
      fontSize: "48px",
    },
  });

export const communityLinkClassName = styleBlock({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    width: "75%",
    transition: "$default",

    "&:hover": {
      color: "$primary",
    },

    "@bp1": {
      width: "50%",
    },

    "@bp2": {
      alignItems: "flex-start",
      width: "240px",
    },
  });

export const sectionClassName = style({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  padding: "0 16px 100px",
});

export const innerClassName = style({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  gap: "100px",
  width: "100%",
});

export const listClassName = styleBlock({
    display: "flex",
    flexDirection: "column",
    gap: "60px",
    justifyContent: "center",

    "@bp2": {
      gap: "120px",
      flexDirection: "row",
    },
  });

export const nameClassName = styleBlock({
    fontWeight: "$semiBold",
    fontSize: "24px",
    lineHeight: "29px",
    margin: "16px 0 12px",
    textAlign: "center",
    letterSpacing: "-0.05em",
  });

export const descriptionClassName = styleBlock({
    color: "$darkTextSecondary",
    fontSize: "16px",
    lineHeight: "140%",
    textAlign: "center",
    letterSpacing: "-0.015em",

    "@bp2": {
      textAlign: "start",
    },
  });
