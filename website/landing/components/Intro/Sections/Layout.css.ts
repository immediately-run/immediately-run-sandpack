import { styleBlock } from "../../../styles/convert"

export const codeWrapperOverrideClassName = styleBlock({
    ".sp-wrapper": {
      height: "420px",
    },

    ".sp-tabs": {
      borderTopLeftRadius: "16px",
      borderTopRightRadius: "16px",
    },

    ".sp-code-editor": {
      borderRadius: 0,
      borderBottomLeftRadius: "16px",
      borderBottomRightRadius: "16px",
    },
    ".sp-cm": {
      height: "380px",
    },
  });

export const mobileContainerOverrideClassName = styleBlock({
    ".custom-layout": { height: "50vh" },
  });
