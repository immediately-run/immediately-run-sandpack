import { style } from "@vanilla-extract/css";

import { styleBlock } from "../../styles/convert"

export const sandpackProviderStretchClassName = style({
  width: "100% !important",
});

export const stickyBoxClassName = styleBlock({
    right: 0,

    position: "relative",
    marginBottom: "calc(50vh - 15%)",

    "*": {
      transition: ".2s ease background, .2s ease color",
    },
  });

export const layoutContainerClassName = style({
  position: "absolute",
  top: "0",
});

export const examplesListClassName = styleBlock({
    display: "flex",
    flexWrap: "wrap",
    gap: "100px",
    width: "100%",

    "@bp1": {
      width: "initial",
      "--gap": "200px",
    },

    "@bp2": {
      marginTop: "calc((50vh - 15%) * -1)",
      alignItems: "center",
      flexDirection: "column",
      "--gap": "0",
      scrollSnapType: "y mandatory",

      ".fade-animation:last-child": {
        paddingBottom: "200px ",
      },
    },
  });
