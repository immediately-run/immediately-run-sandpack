import { styleBlock } from "../../styles/convert"

export const codeBlockClassName = styleBlock({
    width: "100%",
    paddingTop: "30px !important",
    pre: { padding: 0 },

    ".cm-scroller": {
      padding: "var(--sp-space-3) 0 !important",
    },

    ".sp-code-editor": {
      borderRadius: "16px",
      overflow: "hidden",
    },
  });
