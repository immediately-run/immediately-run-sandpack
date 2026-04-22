import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

import { convert, convertVariants, styleBlock } from "../../styles/convert";

export const clipboardToastClassName = recipe({
  base: styleBlock({
    alignItems: "center",
    background: "$primary",
    borderRadius: "72px",
    bottom: "32px",
    display: "flex",
    color: "$lightTextPrimary",
    gap: "10px",
    left: "50%",
    padding: "15px 20px",
    pointerEvents: "none",
    position: "fixed",
    transform: "translateX(-50%) translateY(calc(100% + 240px)) ",
    transition: "transform .5s cubic-bezier(0.190, 1.000, 0.220, 1.000)",
    zIndex: "1",

    span: {
      fontSize: "1.6rem",
      letterSpacing: "-0.025em",
      margin: 0,
    },
  }),
  variants: convertVariants({
    visible: {
      true: {
        transform: "translateX(-50%) translateY(0) ",
      },
    },
  }),
});

export const clipboardToastIconClassName = style({
  display: "flex",
  height: "16px",
  width: "16px",
  "@media": {
    "screen and (min-width: 1920px)": {
      height: "24px",
      width: "24px",
    },
  },
});
