import type { CodeEditorRef } from "@codesandbox/sandpack-react";
import {
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { motion, useTransform, useViewportScroll } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Clipboard, Resources } from "../../common";

import {
  bottomRowClassName,
  containerClassName,
  editorColumnClassName,
  logoClassName,
  logoOuterClassName,
  previewOverlayClassName,
  rightColumnClassName,
  stickyContentClassName,
  subtitleClassName,
  topRowClassName,
} from "./HeroDesktop.css";
import { SandpackTitle } from "./SandpackTitle";

export const HeroDesktop: React.FC = () => {
  const { scrollY } = useViewportScroll();
  const { sandpack } = useSandpack();

  const editorRef = useRef<CodeEditorRef>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionTop, setSectionTop] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(scrollY.get());
  const scrollHeight = useMemo(() => sectionHeight / 3, [sectionHeight]);
  const [animationComplete, setAnimationComplete] = useState(false);
  const isMountedRef = useRef(false);

  scrollY.onChange((updatedScroll) => setScrollPosition(updatedScroll));

  useEffect(() => {
    const isAnimationComplete =
      scrollPosition >= sectionTop + scrollHeight * 1.2 + 2;

    setAnimationComplete(isAnimationComplete);
  }, [animationComplete, scrollHeight, scrollPosition, sectionTop]);

  const progress = useTransform(
    scrollY,
    [sectionTop, sectionTop + scrollHeight],
    [0, 1]
  );

  const opacity = useTransform(
    scrollY,
    [sectionTop + scrollHeight * 0.6, sectionTop + scrollHeight * 0.8],
    [1, 0]
  );

  const progressInverse = useTransform(
    scrollY,
    [sectionTop, sectionTop + scrollHeight],
    [1, 0]
  );

  const rotate = useTransform(
    scrollY,
    [sectionTop + scrollHeight * 0.9, sectionTop + scrollHeight * 1.1],
    [-90, 0]
  );

  const scale = useTransform(
    scrollY,
    [sectionTop, sectionTop + scrollHeight],
    [2.08, 1]
  );

  const containerScale = useTransform(
    scrollY,
    [sectionTop, sectionTop + scrollHeight],
    [1, 0.94]
  );

  const sandpackPreviewOpacity = useTransform(
    scrollY,
    [sectionTop + scrollHeight * 1.2 + 1, sectionTop + scrollHeight * 1.2 + 2],
    [0, 1]
  );

  useLayoutEffect(() => {
    const hero = sectionRef.current;
    if (!hero) return;

    const onResize = (): void => {
      const updatedTop = hero.offsetTop;
      setSectionTop(updatedTop);

      const updatedHeight = hero.offsetHeight;
      setSectionHeight(updatedHeight);
    };

    onResize();

    window.addEventListener("resize", onResize);
    return (): void => window.removeEventListener("resize", onResize);
  }, [sectionRef]);

  useLayoutEffect(() => {
    if (isMountedRef.current) return;

    isMountedRef.current = !!sectionRef.current;
  }, [sectionRef]);

  useEffect(() => {
    const editorElement = editorRef.current?.getCodemirror();
    if (!editorElement) return;

    if (animationComplete && !editorElement.hasFocus) {
      editorElement.focus();

      const newState = editorElement.state.update({
        selection: { anchor: 322 },
      });

      if (newState) {
        editorElement.update([newState]);
      }
    }
  }, [animationComplete, editorRef]);

  useEffect(() => {
    const editorElement = editorRef.current?.getCodemirror();
    if (!editorElement) return;

    const finishAnimation = (): void => {
      window.scrollTo({
        top: sectionTop + scrollHeight * 1.2 + 2,
        behavior: "smooth",
      });
    };

    const element = editorElement.scrollDOM.querySelector(".cm-content");

    element?.addEventListener("focus", finishAnimation);

    return (): void => {
      element?.removeEventListener("focus", finishAnimation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef.current]);

  useEffect(() => {
    if (!animationComplete) {
      sandpack.resetAllFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationComplete]);

  const isMounted = isMountedRef.current;

  return (
    <motion.div
      ref={sectionRef}
      className={containerClassName}
      id="container"
      style={
        {
          "--progress": isMounted ? progress : 0,
          "--opacity": isMounted ? opacity : 1,
          "--progress-inverse": isMounted ? progressInverse : 1,
          "--rotate": isMounted ? rotate : -90,
          "--scale": isMounted ? scale : 2.08,
          "--container-scale": isMounted ? containerScale : 1,
          "--sandpack-preview-opacity": isMounted ? sandpackPreviewOpacity : 0,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      }
    >
      <div
        className={stickyContentClassName}
        id="content"
        style={{ opacity: isMounted ? 1 : 0 }}
      >
        <div
          className={editorColumnClassName}
          style={{
            zIndex: animationComplete ? 1 : 0,
            pointerEvents: animationComplete ? "auto" : "none",
          }}
        >
          <SandpackCodeEditor ref={editorRef} />
          <div className={previewOverlayClassName}>
            <SandpackPreview />
          </div>
        </div>

        <div
          className={rightColumnClassName}
          style={{
            zIndex: animationComplete ? 0 : 1,
            opacity: isMounted ? 1 : 0,
          }}
        >
          <div className={topRowClassName}>
            <Clipboard />
            <Resources />
          </div>

          <div className={logoOuterClassName}>
            <div className={logoClassName} />

            <p className={subtitleClassName}>
              Run any JavaScript and Node.js app
              <br /> in any browser,
              <br />
              powered by CodeSandbox.
            </p>
          </div>

          <div className={bottomRowClassName}>
            <SandpackTitle />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
