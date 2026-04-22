import { motion } from "framer-motion";

import { styled } from "../../styles/styled";

import { animatedBox, box } from "./Box.css";

export const AnimatedBox = styled(motion.div, animatedBox);
export const Box = styled("div", box);
