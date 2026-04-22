import { styleBlock } from "../../styles/convert"

export const featuresContainerClassName = styleBlock({
    "@bp2": {
      maxWidth: "65%",
    },
  });

export const featuresHeaderClassName = styleBlock({
    "@bp2": { alignItems: "flex-start" },
  });

export const featuresTitleClassName = styleBlock({ "@bp2": { textAlign: "start" } });

export const featuresListClassName = styleBlock({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "48px",
    justifyContent: "center",
    transition: "opacity .5s cubic-bezier(0.770, 0.000, 0.175, 1.000)",

    "@bp1": {
      "--gap": "80px",
    },

    "@bp2": {
      alignItems: "flex-start",
      flexDirection: "row",
      marginTop: "100px",
      marginBottom: " 200px",
      justifyContent: "space-between",
    },
  });

export const featureIconClassName = styleBlock({
    alignItems: "center",
    color: "$lightTextPrimary",
    background: "$primary",
    borderRadius: "100%",
    display: "flex",
    flexShrink: "0",
    flexGrow: "0",
    height: "78px",
    justifyContent: "center",
    marginBottom: "20px",
    padding: "18px",
    width: "78px",
  });
