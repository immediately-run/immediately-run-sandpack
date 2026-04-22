import * as React from "react";

import { useClassNames } from "../../utils/classNames";

import {
  cubeClassName,
  sidesClassNames,
  wrapperClassName,
} from "./Loading.css";
import { OpenInCodeSandboxButton } from "./OpenInCodeSandboxButton";

export const Loading = ({
  className,
  showOpenInCodeSandbox,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  showOpenInCodeSandbox: boolean;
}): JSX.Element => {
  const classNames = useClassNames();

  return (
    <div
      className={classNames("cube-wrapper", [wrapperClassName, className])}
      title="Open in CodeSandbox"
      {...props}
    >
      {showOpenInCodeSandbox && <OpenInCodeSandboxButton />}
      <div className={classNames("cube", [cubeClassName])}>
        <div className={classNames("sides", [sidesClassNames])}>
          <div className="top" />
          <div className="right" />
          <div className="bottom" />
          <div className="left" />
          <div className="front" />
          <div className="back" />
        </div>
      </div>
    </div>
  );
};
