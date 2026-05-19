import { globalStyle, keyframes, style } from "@vanilla-extract/css";

import { buttonClassName } from "../../styles/shared.css";
import { vars } from "../../styles/vars.css";

export const cubeClassName = style({
  transform: "translate(-4px, 9px) scale(0.13, 0.13)",
});

globalStyle(`.${cubeClassName} *`, {
  position: "absolute",
  width: "96px",
  height: "96px",
});

export const wrapperClassName = style({
  position: "absolute",
  right: vars.space[2],
  bottom: vars.space[2],
  zIndex: vars.zIndices.top,
  width: "32px",
  height: "32px",
  borderRadius: vars.border.radius,
});

globalStyle(`.${wrapperClassName} .${cubeClassName}`, { display: "flex" });
globalStyle(`.${wrapperClassName} .sp-button.${buttonClassName}`, {
  display: "none",
});
globalStyle(`.${wrapperClassName}:hover .sp-button.${buttonClassName}`, {
  display: "flex",
});
globalStyle(`.${wrapperClassName}:hover .sp-button.${buttonClassName} > span`, {
  display: "none",
});
globalStyle(`.${wrapperClassName}:hover .${cubeClassName}`, {
  display: "none",
});

const cubeRotate = keyframes({
  "0%": {
    transform: "rotateX(-25.5deg) rotateY(45deg)",
  },
  "100%": {
    transform: "rotateX(-25.5deg) rotateY(405deg)",
  },
});

export const sidesClassNames = style({
  animation: `${cubeRotate} 1s linear infinite`,
  animationFillMode: "forwards",
  transformStyle: "preserve-3d",
  transform: "rotateX(-25.5deg) rotateY(45deg)",
});

globalStyle(`.${sidesClassNames} *`, {
  border: `10px solid ${vars.colors.clickable}`,
  borderRadius: "8px",
  background: vars.colors.surface1,
});
globalStyle(`.${sidesClassNames} .top`, {
  transform: "rotateX(90deg) translateZ(44px)",
  transformOrigin: "50% 50%",
});
globalStyle(`.${sidesClassNames} .bottom`, {
  transform: "rotateX(-90deg) translateZ(44px)",
  transformOrigin: "50% 50%",
});
globalStyle(`.${sidesClassNames} .front`, {
  transform: "rotateY(0deg) translateZ(44px)",
  transformOrigin: "50% 50%",
});
globalStyle(`.${sidesClassNames} .back`, {
  transform: "rotateY(-180deg) translateZ(44px)",
  transformOrigin: "50% 50%",
});
globalStyle(`.${sidesClassNames} .left`, {
  transform: "rotateY(-90deg) translateZ(44px)",
  transformOrigin: "50% 50%",
});
globalStyle(`.${sidesClassNames} .right`, {
  transform: "rotateY(90deg) translateZ(44px)",
  transformOrigin: "50% 50%",
});
