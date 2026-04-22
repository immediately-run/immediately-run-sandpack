import { styleBlock } from "../../styles/convert"

export const logoWrapperClassName = styleBlock({
    $$halfHeight: "150px",
    alignItems: "center",
    display: "flex",
    height: "$$halfHeight",
    justifyContent: "center",
    position: "relative",
  });

export const logoHalfClassName = styleBlock({
    $$borderWidth: "14px",
    border: "$$borderWidth solid $$primaryTextColor",
    height: "$$halfHeight",
    width: "82px",

    "&[data-position='left']": {
      transform: "translateX(calc($$borderWidth / 2))",
    },

    "&[data-position='right']": {
      transform: "translateX(calc(-1 * ($$borderWidth / 2)))",
    },
  });
