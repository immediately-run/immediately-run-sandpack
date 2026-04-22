import { recipe } from "@vanilla-extract/recipes";

import { convert, convertVariants, styleBlock } from "../../styles/convert";

export const textClassName = recipe({
  base: styleBlock({
    fontFamily: "$base",
    margin: 0,

    code: {
      alignItems: "center",
      background: "$primary",
      borderRadius: "24px",
      color: "$lightTextPrimary",
      display: "inline-flex",
      fontWeight: "$normal",
      fontSize: "inherit",
      lineHeight: "inherit",
      letterSpacing: "inherit",
      padding: "4px 12px",
    },

    ".highlight": {
      color: "$primary",
    },
  }),
  variants: convertVariants({
    screenReader: {
      true: {
        border: "0 !important",
        clipPath: "inset(50%) !important",
        WebkitClipPath: "inset(50%) !important",
        height: "1px !important",
        margin: "-1px !important",
        overflow: "hidden !important",
        padding: "0 !important",
        position: "absolute !important",
        width: "1px !important",
        whiteSpace: "nowrap !important",
      },
    },
  }),
});
