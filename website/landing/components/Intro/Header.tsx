import { classes } from "../../styles/styled";
import content from "../../website.config.json";
import { SectionHeader, CodeBlock } from "../common";

import {
  codeWrapperClassName,
  headerClassName,
  titleClassName,
} from "./Header.css";

export const Header: React.FC = () => {
  const { commands, intro } = content;

  return (
    <SectionHeader className={classes(headerClassName)}>
      <h2
        className={titleClassName}
        dangerouslySetInnerHTML={{ __html: intro.title }}
      />
      <div className={codeWrapperClassName}>
        <CodeBlock>{commands.import}</CodeBlock>
      </div>
    </SectionHeader>
  );
};
