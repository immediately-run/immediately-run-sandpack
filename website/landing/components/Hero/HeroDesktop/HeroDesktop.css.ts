import { styleBlock } from "../../../styles/convert"

export const containerClassName = styleBlock({ height: "200vh" });

export const stickyContentClassName = styleBlock({
    width: "100vw",
    height: "100vh",

    position: "sticky",
    top: 0,
    transform: "scale($container-scale)",
    transition: "opacity 300ms linear",

    display: "flex",
    borderRadius: "calc(var(--progress) * 16px)",
    overflow: "hidden",

    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      height: "100%",
      width: "100%",
      background: "$surface",
      zIndex: -1,
    },
  });

export const editorColumnClassName = styleBlock({
    width: "50vw",

    ".sp-wrapper": {
      display: "flex",
      position: "relative",
    },

    ".sp-tabs": {
      borderBottom: "none",
    },

    ".sp-tabs-scrollable-container": {
      alignItems: "center",
      height: "auto",
      paddingTop: "16px",
      paddingBottom: "2px",
    },

    ".sp-tab-button": {
      padding: "0 1.6em",
      transition: "color .2s ease",
      borderRadius: "9999999px",
      cursor: "pointer",
    },

    ".sp-tab-button:hover": {
      background: "none",
    },

    ".sp-tab-button[data-active=true]": {
      background: "$primary",
      color: "#131313",
      border: "none",
    },

    ".sp-preview-container": {
      background: "transparent",
    },

    ".sp-preview-actions": {
      display: "none",
    },

    ".custom-stack__hero": {
      height: "100vh",
      width: "50vw",

      position: "relative",
    },

    ".custom-stack__hero:first-of-type": {
      borderRight: "1px solid #1c1c1c",
      left: "-50vw",
      transform: "translateX(calc($progress * 100%))",
    },
  });

export const previewOverlayClassName = styleBlock({
    opacity: "$sandpack-preview-opacity",
    position: "absolute",
    top: 0,
    transform: "translateX(100%)",
    transition: "opacity 300ms",

    ".custom-stack__hero": {
      border: "none !important",
    },
  });

export const rightColumnClassName = styleBlock({
    color: "$darkTextPrimary",
    fontSize: "calc(100vw / 1920 * 10)",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
    width: "50vw",
    padding: "1.8em 3.5em",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "opacity 300ms",
  });

export const topRowClassName = styleBlock({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",

    width: "100%",
    transformOrigin: "top right",
    transform: "scale($scale)",
    zIndex: 1,
  });

export const logoOuterClassName = styleBlock({
    "$$logo-height": "18em",
    "$$logo-margin": "-5em",

    width: "calc(100%)",
    height: "calc(1.15 * $$logo-height + -1 * (2 * $$logo-margin))",

    position: "relative",
    overflow: "hidden",
    right: 0,
    transformOrigin: "center right",
    transform: "scale($scale)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

export const logoClassName = styleBlock({
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",

    width: "100%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(calc($rotate * 1deg))",

    "&::before, &::after": {
      boxSizing: "content-box",
      content: "''",
      display: "block",

      border: "2.4em solid $darkTextPrimary",
      width: "9em",
      height: "$$logo-height",
    },

    "&::before": {
      marginTop: "$$logo-margin",
      marginRight: "-1.1em",
      transform:
        "translateY(calc(-1 * ($progress-inverse * 100vw / 2)))",
    },

    "&::after": {
      marginBottom: "$$logo-margin",
      marginLeft: "-1.1em",
      transform: "translateY(calc(1 * ($progress-inverse * 100vw / 2)))",
    },
  });

export const subtitleClassName = styleBlock({
    fontSize: "1.2em",
    textAlign: "center",
    opacity: "$opacity",
  });

export const bottomRowClassName = styleBlock({
    display: "flex",
    width: "100%",
    transform: "scale($scale)",
    transformOrigin: "bottom right",
  });
