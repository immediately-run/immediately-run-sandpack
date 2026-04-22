import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../../styles/vars.css";

export const sandpackLogoClassName = recipe({
  variants: {
    theme: {
      light: { color: vars.colors.darkTextPrimary },
      dark: { color: vars.colors.lightTextPrimary },
    },
  },
  defaultVariants: { theme: "dark" },
});
