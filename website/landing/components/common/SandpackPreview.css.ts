import { styleBlock } from "../../styles/convert"

export const sandpackContainerClassName = styleBlock({
    alignItems: "center",
    display: "flex",
    overflow: "hidden",
    width: "100%",

    ".custom-wrapper": {
      width: "100%",
    },

    ".custom-layout": {
      width: "100%",
      height: "512px",
      border: 0,

      "@bp1": {
        width: "384px",
        height: "608px",
        margin: "0 auto",
      },

      "@bp2": {
        height: "448px",
        width: "996px",
      },

      "@bp3": {
        width: "1300px",
        height: "50vh",
      },
    },

    ".custom-stack": {
      "@bp2": {
        height: "100% !important",
        width: "100% !important",
      },
    },
  });
