import { styled } from "../../styles/styled";

import {
  cardClassName,
  cardDescriptionClassName,
  cardTitleClassName,
} from "./Card.css";

type SizeVariant = { size?: "small" };

export const Card = styled<"div", SizeVariant>("div", cardClassName);
export const CardTitle = styled<"h3", SizeVariant>("h3", cardTitleClassName);
export const CardDescription = styled<"p", SizeVariant>(
  "p",
  cardDescriptionClassName,
);
