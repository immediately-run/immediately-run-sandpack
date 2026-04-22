import { recipe } from "@vanilla-extract/recipes";

import { convert, convertVariants, styleBlock } from "../../styles/convert";

export const cardClassName = recipe({
  base: styleBlock({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "336px",

    "@bp1": {
      "--gap": "20px",
      width: "384px",
    },

    "@bp2": {
      alignItems: "flex-start",
      width: "360px",
    },

    "@bp3": {
      width: "480px",
    },
  }),
  variants: convertVariants({
    size: {
      small: {
        "--gap": "10px",

        "@bp2": {
          width: "100%",
        },
      },
    },
  }),
});

export const cardTitleClassName = recipe({
  base: styleBlock({
    color: "$$primaryTextColor",
    fontSize: "24px",
    fontWeight: "$semiBold",
    lineHeight: "1.2",
    letterSpacing: "-0.05em",
    margin: 0,
    textAlign: "center",

    "@bp1": {
      fontSize: "36px",
    },

    "@bp2": {
      textAlign: "left",
    },
  }),
  variants: convertVariants({
    size: {
      small: {
        fontWeight: "$normal",
        fontSize: "24px",
      },
    },
  }),
});

export const cardDescriptionClassName = recipe({
  base: styleBlock({
    color: "$$secondaryTextColor",
    lineHeight: "1.4",
    letterSpacing: "-0.025em",
    fontSize: "16px",
    margin: 0,
    textAlign: "center",

    code: {
      fontFamily: "$mono",
      fontSize: "inherit",
      lineHeight: "inherit",
      letterSpacing: "inherit",
    },

    ".external-link": {
      color: "$$codeBlockForeground",
      textDecoration: "none",

      "&:hover": {
        textDecoration: "underline",
        color: "$primary",
      },
    },

    "@bp2": {
      fontSize: "18px",
      textAlign: "start",

      "a code:after": {
        content: "↗",
        display: "inline-block",
        marginLeft: "8px",
        position: "relative",
        top: 1,
      },

      "a code:hover": {
        background: "$primary",
        color: "$darkBackground",
      },

      code: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px 8px",
        borderRadius: "6px",
        fontFamily: "$mono",
        fontSize: "16px",
        lineHeight: 1.4,
        letterSpacing: "-0.025em",
        background: "$$codeBlockBackground",
        color: "$$codeBlockForeground",
        transition: "$default",
      },
    },
  }),
  variants: convertVariants({
    size: {
      small: {
        letterSpacing: "-0.05em",
      },
    },
  }),
});
