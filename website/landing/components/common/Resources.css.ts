import { style } from "@vanilla-extract/css";

import { styleBlock } from "../../styles/convert"

export const resourceLinkClassName = styleBlock({
    color: "inherit",
    transition: "color .2s ease",
    willChange: "color",

    "&:hover": {
      color: "$primary",
    },
  });

export const resourcesListClassName = style({ display: "flex" });

export const resourcesItemClassName = styleBlock({
    margin: "0 1em",

    "@bp1": {
      margin: 0,
      "&:not(:last-of-type)": {
        marginRight: "2em",
      },
    },
  });

export const resourcesTextClassName = styleBlock({
    fontFamily: "inherit",
    fontWeight: "$semiBold",
    letterSpacing: "-0.05em",

    "@bp2": {
      fontSize: "2.4em",
    },
  });
