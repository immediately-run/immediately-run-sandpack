import { styled } from "../../styles/styled";

import {
  sectionContainerClassName,
  sectionHeaderClassName,
  sectionTitleClassName,
  sectionWrapperClassName,
} from "./Section.css";

type SizeVariant = { size?: "small" };

export const SectionWrapper = styled<"div", { theme?: "light" }>(
  "div",
  sectionWrapperClassName,
);

export const SectionContainer = styled("section", sectionContainerClassName);

export const SectionHeader = styled<"header", SizeVariant>(
  "header",
  sectionHeaderClassName,
);

export const SectionTitle = styled<"h2", SizeVariant>(
  "h2",
  sectionTitleClassName,
);
