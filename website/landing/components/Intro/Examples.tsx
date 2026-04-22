import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { motion, useTransform, useViewportScroll } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

import { classes, styled } from "../../styles/styled";
import { List, SandpackContainer } from "../common";
import { useBreakpoint } from "../common/useBreakpoint";

import {
  examplesListClassName,
  layoutContainerClassName,
  sandpackProviderStretchClassName,
  stickyBoxClassName,
} from "./Examples.css";
import { SandpackExample } from "./SandpackExample";
import { CustomExample } from "./Sections/Custom";
import { EditorExample } from "./Sections/Editor";
import { LayoutExample } from "./Sections/Layout";
import { useLayoutExampleContext } from "./Sections/LayoutContext";
import { TemplateExample } from "./Sections/Template";
import { ThemeExample } from "./Sections/Theme";

const SandpackProviderStretch = styled(
  SandpackProvider,
  sandpackProviderStretchClassName,
);

export const Examples: React.FC = () => {
  const { layoutFiles, visibility } = useLayoutExampleContext();

  const { scrollY } = useViewportScroll();

  const isMedium = useBreakpoint("bp2");
  const isLarge = useBreakpoint("bp3");
  const isXLarge = useBreakpoint("2260");

  const sandpackRefSectionTop = useRef<HTMLDivElement>(null);
  const sandpackRefSectionHeight = useRef<HTMLDivElement>(null);
  const [sandpackSectionTop, setSandpackSectionTop] = useState(0);
  const [sandpackSectionHeight, setSandpackSectionHeight] = useState(0);

  useLayoutEffect(() => {
    const onResize = (): void => {
      if (!sandpackRefSectionTop.current || !sandpackRefSectionHeight.current)
        return;

      setSandpackSectionTop(sandpackRefSectionTop.current?.offsetTop);
      setSandpackSectionHeight(sandpackRefSectionHeight.current?.offsetHeight);
    };

    onResize();
    window.addEventListener("resize", onResize);

    return (): void => window.removeEventListener("resize", onResize);
  }, []);

  const scrollRangeX = [
    sandpackSectionTop * 0.9,
    sandpackSectionTop * 0.95,
    (sandpackSectionTop + sandpackSectionHeight) * 0.85,
  ];

  const breakpoint = (): string => {
    if (isXLarge) return "600px";
    if (isLarge) return "30vw";
    if (isMedium) return "38vw";

    return "35vw";
  };
  const progressRangeX = ["0", "0", breakpoint()];
  const x = useTransform(scrollY, scrollRangeX, progressRangeX);

  return (
    <>
      <div ref={sandpackRefSectionTop} />

      {isMedium && (
        <motion.div
          ref={sandpackRefSectionHeight}
          style={{
            x,
            position: "sticky",
            top: "calc(50vh - 25%)",
          }}
        >
          <div className={stickyBoxClassName}>
            <motion.div
              animate={{ opacity: visibility ? 0 : 1 }}
              initial={{ opacity: 0 }}
              style={{ position: "relative", zIndex: visibility ? -1 : 1 }}
            >
              <SandpackExample />
            </motion.div>

            <SandpackContainer className={classes(layoutContainerClassName)}>
              <motion.div
                animate={{ opacity: visibility ? 1 : 0 }}
                initial={{ opacity: 0 }}
              >
                <SandpackProvider
                  customSetup={{
                    dependencies: { "@codesandbox/sandpack-react": "latest" },
                  }}
                  files={layoutFiles}
                  options={{
                    initMode: "user-visible",
                    classes: {
                      "sp-layout": "custom-layout",
                      "sp-stack": "custom-stack",
                      "sp-wrapper": "custom-wrapper",
                    },
                  }}
                  template="react"
                >
                  <SandpackLayout>
                    <SandpackPreview />
                  </SandpackLayout>
                </SandpackProvider>
              </motion.div>
            </SandpackContainer>
          </div>
        </motion.div>
      )}

      <List className={classes(examplesListClassName)}>
        <TemplateExample />

        <SandpackProviderStretch>
          <CustomExample />
        </SandpackProviderStretch>

        <SandpackProviderStretch>
          <EditorExample />
        </SandpackProviderStretch>

        <ThemeExample />

        <SandpackProviderStretch template="react">
          <LayoutExample />
        </SandpackProviderStretch>
      </List>
    </>
  );
};
