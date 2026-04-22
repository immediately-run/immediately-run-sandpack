import { styleBlock } from "../../styles/convert"

export const sectionWrapperOverrideClassName = styleBlock({ overflow: "hidden" });

export const sectionHeaderOverrideClassName = styleBlock({ gap: "40px" });

export const listOverrideClassName = styleBlock({
    gap: "100px",
    width: "100%",

    "@bp1": {
      "--gap": "200px",
    },

    "@bp2": {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      flexDirection: "column",
      "--gap": "0",
      scrollSnapType: "y mandatory",
      width: "initial",
    },
  });

export const listItemOverrideClassName = styleBlock({
    width: "100%",
    "@bp2": { width: "initial" },
  });
