import { style } from "@vanilla-extract/css";

import { styleBlock } from "../../styles/convert"

export const headerClassName = styleBlock({ gap: "40px" });

export const titleClassName = styleBlock({
    fontSize: "36px",
    fontWeight: "$semiBold",
    letterSpacing: "-0.05em",
    lineHeight: "1",
    textAlign: "center",

    "@bp1": {
      fontSize: "72px",
    },

    "@bp2": {
      fontSize: "96px",
    },

    "@bp3": {
      fontSize: "144px",
    },
  });

export const codeWrapperClassName = style({ maxWidth: "100%" });
