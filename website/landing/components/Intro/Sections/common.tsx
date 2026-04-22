/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { motion, useTransform, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useRef } from "react";
import { useLayoutEffect } from "react";
import { forwardRef } from "react";

import { styled } from "../../../styles/styled";
import { useBreakpoint } from "../../common/useBreakpoint";

import {
  captionClassName,
  codeWrapperClassName,
  contentClassName,
  refreshButtonClassName,
  rowInnerClassName,
  rowOuterClassName,
  sandpackContainerMobileClassName,
  sandpackContainerPlaceholderClassName,
  snippetButtonClassName,
  tooltipClassName,
} from "./common.css";

export const THRESHOLD_VIEW = 0.5;

// eslint-disable-next-line react/display-name
export const Row = forwardRef<unknown, { children: React.ReactNode }>(
  ({ children }, ref) => {
    return (
      <div ref={ref as any} className={rowOuterClassName}>
        <div className={rowInnerClassName}>{children}</div>
      </div>
    );
  }
);

export const Content = styled("div", contentClassName);

export const SandpackContainerPlaceholder = styled(
  "div",
  sandpackContainerPlaceholderClassName,
);

export const SandpackContainerMobile = styled(
  "div",
  sandpackContainerMobileClassName,
);

export const getRelativeCoordinates = (
  event: any,
  referenceElement: any
): Record<"x" | "y", number> => {
  const position = {
    x: event.pageX,
    y: event.pageY,
  };

  const offset = {
    left: referenceElement.offsetLeft,
    top: referenceElement.offsetTop,
  };

  let reference = referenceElement.offsetParent;

  while (reference) {
    offset.left += reference.offsetLeft;
    offset.top += reference.offsetTop;
    reference = reference.offsetParent;
  }

  return {
    x: position.x - offset.left + 15,
    y: position.y - offset.top - 35,
  };
};

export const ToolTip = styled(motion.div, tooltipClassName);

export const SnippetButton = styled("button", snippetButtonClassName);

export const RefreshButton = styled("button", refreshButtonClassName);

export const FadeAnimation: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const sectionRef = useRef<HTMLLIElement>(null);
  const [sectionTop, setSectionTop] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);
  const shouldAnimate = useBreakpoint("bp2");

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

  const { scrollY } = useViewportScroll();
  const opacity = useTransform(
    scrollY,
    [
      sectionTop - sectionHeight / 1.5,
      sectionTop - sectionHeight / 3,
      sectionTop - sectionHeight / 6,
      sectionTop + sectionHeight / 6,
      sectionTop + sectionHeight / 4,
      sectionTop + sectionHeight / 2,
    ],
    [shouldAnimate ? 0 : 1, 1, 1, 1, 1, shouldAnimate ? 0 : 1]
  );
  const pointerEvents = opacity.get() ? "auto" : "none";

  return (
    <motion.li
      ref={sectionRef}
      className="fade-animation"
      style={{ opacity, pointerEvents, width: "100%" }}
    >
      {children}
    </motion.li>
  );
};

FadeAnimation.toString = (): string => `.fade-animation`;

export const CodeWrapper = styled("div", codeWrapperClassName);

export const Caption = styled("p", captionClassName);
