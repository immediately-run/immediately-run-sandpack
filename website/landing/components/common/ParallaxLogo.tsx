import { motion, useSpring } from "framer-motion";
import type { MotionValue } from "framer-motion";

import { styled } from "../../styles/styled";

import { logoHalfClassName, logoWrapperClassName } from "./ParallaxLogo.css";

const LogoWrapper = styled("div", logoWrapperClassName);
const LogoHalf = styled("div", logoHalfClassName);

const SPRING_OPTIONS = { stiffness: 200, damping: 20 };

const baseStyles = {
  height: "100%",
  width: "100%",
};

interface ParallaxLogoProps {
  leftRange: MotionValue;
  rightRange: MotionValue;
}
export const ParallaxLogo: React.FC<ParallaxLogoProps> = ({
  leftRange,
  rightRange,
}) => {
  const leftY = useSpring(leftRange, SPRING_OPTIONS);
  const rightY = useSpring(rightRange, SPRING_OPTIONS);

  return (
    <LogoWrapper>
      <motion.div style={{ ...baseStyles, y: leftY }}>
        <LogoHalf data-position="left" />
      </motion.div>
      <motion.div style={{ ...baseStyles, y: rightY }}>
        <LogoHalf data-position="right" />
      </motion.div>
    </LogoWrapper>
  );
};
