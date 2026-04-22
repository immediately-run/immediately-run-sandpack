import { classes } from "../../styles/styled";
import { SectionWrapper, SectionContainer } from "../common";

import { Examples } from "./Examples";
import { Header } from "./Header";
import { introContainerClassName } from "./Intro.css";
import { SandpackExampleProvider } from "./SandpackExample";
import { LayoutExampleProvider } from "./Sections/LayoutContext";

export const Intro: React.FC = () => {
  return (
    <SandpackExampleProvider>
      <SectionWrapper>
        <SectionContainer className={classes(introContainerClassName)}>
          <Header />
          <LayoutExampleProvider>
            <Examples />
          </LayoutExampleProvider>
        </SectionContainer>
      </SectionWrapper>
    </SandpackExampleProvider>
  );
};
