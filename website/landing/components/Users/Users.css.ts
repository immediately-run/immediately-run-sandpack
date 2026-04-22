import { recipe } from "@vanilla-extract/recipes";

import { convert, convertVariants, styleBlock } from "../../styles/convert";

export const userLinkClassName = recipe({
  base: styleBlock({
    display: "block",
    maxWidth: "75%",
    margin: "0 auto",
    position: "relative",
    opacity: 0,
    transitionProperty: "opacity",
    transitionTimingFunction: "cubic-bezier(0.770, 0.000, 0.175, 1.000)",

    "@bp1": {
      maxWidth: "100%",
    },
  }),
  variants: convertVariants({
    visible: {
      true: { opacity: 1 },
      false: { opacity: 0 },
    },
  }),
});

export const usersContainerClassName = styleBlock({
    maxWidth: "1600px",
    "@bp1": {
      paddingBottom: "200px",
    },
  });

export const usersHeaderClassName = styleBlock({
    padding: "20px 0 100px",

    "@bp2": {
      padding: "200px 0 100px",
    },
  });

export const usersListClassName = styleBlock({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",

    margin: "0 auto",
    marginTop: "-50px",

    "@bp2": {
      flexDirection: "row",
      flexFlow: "row wrap",
      width: "75%",
    },
  });

export const usersItemClassName = styleBlock({
    flex: "none",
    margin: "20px",
    "@bp2": {
      margin: "50px",
    },
  });
