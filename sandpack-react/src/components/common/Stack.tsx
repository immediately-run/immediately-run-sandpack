import * as React from "react";

import { useClassNames } from "../../utils/classNames";

import { stackClassName } from "./Stack.css";

export { stackClassName };

export const SandpackStack: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
> = ({ className, ...props }) => {
  const classNames = useClassNames();

  return (
    <div
      className={classNames("stack", [stackClassName, className])}
      {...props}
    />
  );
};
