import { motion, useTransform, useViewportScroll } from "framer-motion";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import { classes } from "../../styles/styled";
import content from "../../website.config.json";
import {
  List,
  SectionWrapper,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  Card,
  CardTitle,
  CardDescription,
} from "../common";
import { useBreakpoint } from "../common/useBreakpoint";

import {
  animatedListItemClassName,
  cardCenterClassName,
  cardDescriptionCenterClassName,
  cardTitleCenterClassName,
  highlightAnchorClassName,
  previewWrapperClassName,
  sectionHeaderClassName,
  sectionInnerClassName,
  showcaseListClassName,
} from "./Showcase.css";

const HighlightPreview: React.FC<{ source: string; alt: string }> = ({
  source,
  alt,
}) => {
  return (
    <div className={previewWrapperClassName}>
      <Image alt={alt} height={1440} src={source} width={960} />
    </div>
  );
};

export const Showcase: React.FC = () => {
  const shouldAnimate = useBreakpoint("bp2");

  const { showCase } = content;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionTop, setSectionTop] = useState(0);
  const [sectionScroll, setSectionScroll] = useState(0);

  const { scrollY } = useViewportScroll();
  const scrollInput = [sectionTop, sectionTop + sectionScroll];
  const translateOutput = ["-25%", "25%"];
  const leftColumnTranslateY = useTransform(
    scrollY,
    scrollInput,
    translateOutput
  );

  useLayoutEffect(() => {
    const container = sectionRef.current;
    if (!container || !window) return;

    const onResize = (): void => {
      setSectionTop(container.offsetTop);
      setSectionScroll(container.offsetHeight - window.innerHeight);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return (): void => window.removeEventListener("resize", onResize);
  }, [sectionRef]);

  return (
    <SectionWrapper ref={sectionRef}>
      <SectionContainer>
        <SectionHeader className={classes(sectionHeaderClassName)}>
          <SectionTitle dangerouslySetInnerHTML={{ __html: showCase.title }} />
        </SectionHeader>
        <div className={sectionInnerClassName}>
          <List className={classes(showcaseListClassName)}>
            {showCase.highlights.map((item, hIndex) => (
              <motion.li
                key={`showcase-highlight-${hIndex}`}
                className={animatedListItemClassName}
                style={{
                  translateY:
                    hIndex % 2 === 0 && shouldAnimate
                      ? leftColumnTranslateY
                      : "0",
                }}
              >
                <a
                  className={highlightAnchorClassName}
                  href={item.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div>
                    <HighlightPreview
                      alt={item.title}
                      source={item.imageSource}
                    />
                  </div>
                  <Card className={classes(cardCenterClassName)}>
                    <CardTitle
                      className={classes(cardTitleCenterClassName)}
                      dangerouslySetInnerHTML={{
                        __html: item.title,
                      }}
                    />
                    <CardDescription
                      className={classes(cardDescriptionCenterClassName)}
                      dangerouslySetInnerHTML={{
                        __html: item.description,
                      }}
                    />
                  </Card>
                </a>
              </motion.li>
            ))}
          </List>
        </div>
      </SectionContainer>
    </SectionWrapper>
  );
};
