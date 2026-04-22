import { styleBlock } from "../../styles/convert"

export const clipboardButtonClassName = styleBlock({
    alignItems: "center",
    color: "$darkTextPrimary",
    cursor: "pointer",
    display: "flex",
    transition: "color .2s ease",
    willChange: "color",

    "> div": {
      opacity: 0,
      transition: "opacity .2s ease",
      willChange: "opacity",
    },

    "&:hover": {
      color: "$primary",

      "> div": {
        opacity: 1,
      },
    },
  });

export const clipboardTextClassName = styleBlock({
    fontFamily: "inherit",
    letterSpacing: "-0.05em",

    "@bp2": {
      fontSize: "2.4em",
    },
  });

export const clipboardIconBoxClassName = styleBlock({
    flexShrink: "0",
    height: "12px",
    width: "12px",
    top: 1,
    position: "relative",
    marginLeft: "12px",

    "@bp2": {
      height: "16px",
      width: "16px",
    },
  });
