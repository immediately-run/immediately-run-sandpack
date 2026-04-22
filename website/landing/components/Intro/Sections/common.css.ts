import { styleBlock } from "../../../styles/convert"

export const rowOuterClassName = styleBlock({
    width: "100%",
    "@bp2": {
      width: "initial",
      height: "80vh",
      maxHeight: "1080px",
    },
  });

export const rowInnerClassName = styleBlock({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",

    gap: "40px",

    "@bp2": {
      "--gap": "240px",
      alignItems: "center",
      flexDirection: "row",
      scrollSnapAlign: "center",
    },

    "@bp3": {
      "--gap": "320px",
    },
  });

export const contentClassName = styleBlock({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",

    "@bp1": {
      width: "384px",
    },

    "@bp2": {
      alignItems: "flex-start",
      width: "28%",
    },
  });

export const sandpackContainerPlaceholderClassName = styleBlock({
    width: "500px",
    "@bp2": { width: "28%" },
  });

export const sandpackContainerMobileClassName = styleBlock({
    width: "100%",

    "@bp1": {
      width: "auto",
    },

    "@bp2": {
      display: "none",
    },
  });

export const tooltipClassName = styleBlock({
    alignItems: "center",
    background: "$primary",
    borderRadius: "24px",
    color: "$lightTextPrimary",
    fontWeight: "$normal",
    fontSize: "inherit",
    lineHeight: "inherit",
    letterSpacing: "inherit",
    padding: "4px 12px",
    display: "inline-block",
  });

export const snippetButtonClassName = styleBlock({
    background: "none",
    border: "none",
    maxWidth: "100%",
    padding: 0,

    ".sp-wrapper": {
      cursor: "pointer",
      userSelect: "none",
    },
  });

export const refreshButtonClassName = styleBlock({
    background: "rgba(136, 136, 136, 0.2)",
    border: "none",
    color: "rgba(255,255,255, .5)",
    borderRadius: "100%",
    width: "24px",
    height: "24px",
    display: "flex",
    padding: 0,
    cursor: "pointer",

    position: "absolute",
    bottom: "12px",
    right: "10px",

    transition: "$default",

    "&:hover": {
      color: "rgba(255,255,255, 1)",
    },

    svg: {
      padding: "1px",
      margin: "auto",
    },
  });

export const codeWrapperClassName = styleBlock({
    position: "relative",
    width: "100%",
    paddingTop: "30px !important",

    "pre:not(.sp-pre-placeholder)": { padding: 0 },

    ".sp-code-editor": {
      borderRadius: "16px",
    },
  });

export const captionClassName = styleBlock({
    "@bp1": {
      display: "none",
    },
  });
