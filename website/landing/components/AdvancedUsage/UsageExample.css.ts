import { recipe } from "@vanilla-extract/recipes";

import { convert, convertVariants, styleBlock } from "../../styles/convert";

export const outerClassName = styleBlock({
    "@bp2": { height: "100vh", maxHeight: "1080px" },
  });

export const innerClassName = recipe({
  base: styleBlock({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    justifyContent: "center",
    width: "100%",
    height: "100%",

    "@bp2": {
      alignItems: "center",
      "--gap": "240px",

      scrollSnapAlign: "center",
      width: "initial",
    },

    "@bp3": {
      "--gap": "320px",
    },
  }),
  variants: convertVariants({
    direction: {
      reverse: {
        "@bp2": { flexDirection: "row-reverse" },
      },
      normal: {
        "@bp2": { flexDirection: "row" },
      },
    },
  }),
});
