import { styleBlock } from "../../styles/convert"

export const footerClassName = styleBlock({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    flexShrink: "O",
    padding: "50px 0",

    "@bp2": {
      padding: "100px 0",
    },
  });

export const footerTextClassName = styleBlock({
    fontFamily: "$base",
    fontWeight: "$normal",
    fontSize: "12px",
    lineHeight: "15px",
    textAlign: "center",
    letterSpacing: "-0.0125em",
  });
