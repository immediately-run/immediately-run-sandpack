import { useTransform, useViewportScroll } from "framer-motion";
import React, { useLayoutEffect, useRef, useState } from "react";

import { advancedUsage as content } from "../../website.config.json";
import { classes } from "../../styles/styled";
import {
  List,
  ListItem,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionWrapper,
} from "../common";
import { ParallaxLogo } from "../common/ParallaxLogo";
import { useBreakpoint } from "../common/useBreakpoint";

import {
  listItemOverrideClassName,
  listOverrideClassName,
  sectionHeaderOverrideClassName,
  sectionWrapperOverrideClassName,
} from "./AdvancedUsage.css";
import { UsageExample } from "./UsageExample";

export const AdvancedUsage: React.FC = () => {
  const section = useRef<HTMLDivElement>(null);
  const [sectionTop, setSectionTop] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const shouldAnimate = useBreakpoint("bp2");

  const { scrollY } = useViewportScroll();
  const leftRange = useTransform(
    scrollY,
    [sectionTop - windowHeight / 2, sectionTop + windowHeight / 2],
    shouldAnimate ? [-20, 40] : [-20, -20]
  );
  const rightRange = useTransform(
    scrollY,
    [sectionTop - windowHeight / 2, sectionTop + windowHeight / 2],
    shouldAnimate ? [20, -40] : [20, 20]
  );

  useLayoutEffect(() => {
    const container = section.current;
    if (!container || !window) return;

    const onResize = (): void => {
      setSectionTop(container.offsetTop);
      setWindowHeight(window.innerHeight);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return (): void => window.removeEventListener("resize", onResize);
  }, [section]);

  return (
    <SectionWrapper
      ref={section}
      className={classes(sectionWrapperOverrideClassName)}
      theme="light"
    >
      <SectionContainer>
        <SectionHeader className={classes(sectionHeaderOverrideClassName)}>
          <ParallaxLogo leftRange={leftRange} rightRange={rightRange} />
          <SectionTitle dangerouslySetInnerHTML={{ __html: content.title }} />
        </SectionHeader>
        <List as="ul" className={classes(listOverrideClassName)}>
          {content.examples.map((example, exampleIndex) => (
            <ListItem
              key={`usage-example-${exampleIndex}`}
              className={classes(listItemOverrideClassName)}
            >
              <UsageExample example={example} exampleIndex={exampleIndex} />
            </ListItem>
          ))}
        </List>
      </SectionContainer>
    </SectionWrapper>
  );
};
