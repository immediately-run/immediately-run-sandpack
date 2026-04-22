import { styled } from "../../styles/styled";

import { textClassName } from "./Text.css";

export const Text = styled<"p", { screenReader?: boolean }>(
  "p",
  textClassName,
);
