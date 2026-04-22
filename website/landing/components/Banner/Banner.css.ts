import { styleBlock } from "../../styles/convert"

export const bannerContainerClassName = styleBlock({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "50px",
    overflow: "visible",

    "@bp3": {
      "--gap": "100px",
    },
  });
