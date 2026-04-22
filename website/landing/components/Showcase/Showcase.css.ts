import { style } from "@vanilla-extract/css";

import { styleBlock } from "../../styles/convert"

export const previewWrapperClassName = styleBlock({
    alignItems: "center",
    background: "$surface",
    color: "white",
    display: "flex",
    justifyContent: "center",
    margin: "0 auto",
    width: "100%",

    img: {
      transition: "$default",
      width: "100%",
      height: "auto",
    },
  });

export const sectionHeaderClassName = styleBlock({
    "@bp2": { padding: "200px 0" },
  });

export const sectionInnerClassName = styleBlock({ "@bp2": { marginBottom: "200px", marginTop: "200px" } });

export const showcaseListClassName = styleBlock({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "100px",

    "@bp2": {
      display: "grid",
      "--gap": "280px",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  });

export const animatedListItemClassName = styleBlock({
    "@bp1": {
      width: "384px",
    },
    "@bp2": {
      marginTop: "25%",
      position: "relative",
      width: "360px",

      "&:nth-of-type(odd)": {
        transform: "translateY(0)",
        justifySelf: "flex-end",
      },

      "&:nth-of-type(even)": {
        justifySelf: "flex-start",
        transform: "translateY(-25%)",
      },
    },

    "@bp3": {
      width: "480px",
    },

    "&:hover img": {
      transform: "scale(1.05)",
    },
  });

export const highlightAnchorClassName = style({
  gap: "40px",
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
});

export const cardCenterClassName = style({ alignItems: "center" });

export const cardTitleCenterClassName = styleBlock({ "@bp2": { textAlign: "center" } });

export const cardDescriptionCenterClassName = style({ textAlign: "center" });
