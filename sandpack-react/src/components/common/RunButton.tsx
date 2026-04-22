import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { RunIcon } from "../icons";

import { RoundedButton } from "./RoundedButton";
import { runButtonClassName } from "./RunButton.css";

export const RunButton: React.FC<
  React.PropsWithChildren & React.ButtonHTMLAttributes<unknown>
> = ({ className: _className, onClick, ...props }) => {
  const { sandpack } = useSandpack();

  return (
    <RoundedButton
      className={runButtonClassName}
      onClick={(event): void => {
        sandpack.runSandpack();
        onClick?.(event);
      }}
      {...props}
    >
      <RunIcon />
      <span>Run</span>
    </RoundedButton>
  );
};
