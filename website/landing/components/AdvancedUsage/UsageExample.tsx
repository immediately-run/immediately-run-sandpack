import React from "react";
import { useInView } from "react-intersection-observer";

import { classes } from "../../styles/styled";
import { Box, Card, CardDescription, CardTitle } from "../common";
import { useBreakpoint } from "../common/useBreakpoint";

import { ExampleIllustration } from "./ExampleIllustration";
import { innerClassName, outerClassName } from "./UsageExample.css";

interface Example {
  title: string;
  description: string;
  illustrationKey: string;
}

interface UsageExampleProps {
  example: Example;
  exampleIndex: number;
}
export const UsageExample: React.FC<UsageExampleProps> = ({
  example,
  exampleIndex,
}) => {
  const shouldAnimate = useBreakpoint("bp2");
  const { ref, inView } = useInView({
    threshold: 0,
  });

  return (
    <Box className={classes(outerClassName)}>
      <Box
        className={classes(
          innerClassName({
            direction: exampleIndex % 2 === 0 ? "reverse" : "normal",
          }),
        )}
      >
        <Box ref={ref}>
          <ExampleIllustration
            illustrationKey={example.illustrationKey}
            visible={inView || !shouldAnimate}
          />
        </Box>
        <Box>
          <Card>
            <CardTitle>{example.title}</CardTitle>
            <CardDescription
              dangerouslySetInnerHTML={{
                __html: example.description,
              }}
            />
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
