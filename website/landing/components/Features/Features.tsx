import type { MotionValue } from "framer-motion";
import { motion, useTransform, useViewportScroll } from "framer-motion";
import { useMemo } from "react";
import { useLayoutEffect, useRef, useState } from "react";

import { classes } from "../../styles/styled";
import config from "../../website.config.json";
import {
  Card,
  CardDescription,
  CardTitle,
  List,
  ListItem,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionWrapper,
} from "../common";
import { useBreakpoint } from "../common/useBreakpoint";

import {
  featureIconClassName,
  featuresContainerClassName,
  featuresHeaderClassName,
  featuresListClassName,
  featuresTitleClassName,
} from "./Features.css";
import { ICONS } from "./icons";

interface FeatureFadeProps {
  index: number;
  parentTop: number;
  parentHeight: number;
  scrollY: MotionValue<number>;
  children?: React.ReactNode;
}
const FeatureFade: React.FC<FeatureFadeProps> = ({
  children,
  index,
  parentTop,
  parentHeight,
  scrollY,
}) => {
  const shouldAnimate = useBreakpoint("bp2");
  const opacityRange = [shouldAnimate ? 0 : 1, 1];
  const scrollRange = [
    parentTop - parentHeight / (2 * Math.pow(index + 1, 2)),
    parentTop + parentHeight / (index === 0 ? 6 : 4),
  ];
  const opacity = useTransform(scrollY, scrollRange, opacityRange);

  return <motion.div style={{ opacity }}>{children}</motion.div>;
};

export const Features: React.FC = () => {
  const content = config.features;

  const { scrollY } = useViewportScroll();

  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionTop, setSectionTop] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);

  useLayoutEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const onResize = (): void => {
      setSectionTop(sectionEl.offsetTop);
      setSectionHeight(sectionEl.offsetHeight);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return (): void => window.removeEventListener("resize", onResize);
  }, [sectionRef]);

  const fadeProps = useMemo(
    () => ({ scrollY, parentTop: sectionTop, parentHeight: sectionHeight }),
    [scrollY, sectionTop, sectionHeight]
  );

  return (
    <SectionWrapper ref={sectionRef}>
      <SectionContainer className={classes(featuresContainerClassName)}>
        <FeatureFade index={0} {...fadeProps}>
          <SectionHeader className={classes(featuresHeaderClassName)}>
            <SectionTitle
              className={classes(featuresTitleClassName)}
              dangerouslySetInnerHTML={{ __html: content.title }}
            />
          </SectionHeader>
        </FeatureFade>
        <List className={classes(featuresListClassName)}>
          {content.highlights.map((highlight, highlightIndex) => {
            const icon = ICONS[highlight.iconKey as keyof typeof ICONS];

            return (
              <ListItem key={`content-highlight-${highlightIndex}`}>
                <FeatureFade index={highlightIndex + 1} {...fadeProps}>
                  <Card size="small">
                    <div className={featureIconClassName}>{icon}</div>
                    <CardTitle size="small">{highlight.title}</CardTitle>
                    <CardDescription
                      dangerouslySetInnerHTML={{
                        __html: highlight.description,
                      }}
                      size="small"
                    />
                  </Card>
                </FeatureFade>
              </ListItem>
            );
          })}
        </List>
      </SectionContainer>
    </SectionWrapper>
  );
};
