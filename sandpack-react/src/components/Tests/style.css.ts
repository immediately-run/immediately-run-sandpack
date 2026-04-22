import { recipe } from "@vanilla-extract/recipes";

import { vars } from "../../styles/vars.css";

const color = recipe({
  variants: {
    status: {
      pass: { color: "var(--test-pass)" },
      fail: { color: "var(--test-fail)" },
      skip: { color: "var(--test-skip)" },
      title: { color: "var(--test-title)" },
    },
  },
});

export const passTextClassName = color({ status: "pass" });
export const failTextClassName = color({ status: "fail" });
export const skipTextClassName = color({ status: "skip" });
export const titleTextClassName = color({ status: "title" });

const background = recipe({
  variants: {
    status: {
      pass: { background: "var(--test-pass)", color: vars.colors.surface1 },
      fail: { background: "var(--test-fail)", color: vars.colors.surface1 },
      run: { background: "var(--test-run)", color: vars.colors.surface1 },
    },
  },
});

export const runBackgroundClassName = background({ status: "run" });
export const passBackgroundClassName = background({ status: "pass" });
export const failBackgroundClassName = background({ status: "fail" });
