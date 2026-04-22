import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { useClassNames } from "../../utils/classNames";
import { useCombinedRefs } from "../CodeEditor/utils";

import { layoutClassName } from "./Layout.css";

export { layoutClassName };

export interface SandpackLayoutProps extends React.HtmlHTMLAttributes<unknown> {
  children?: React.ReactNode;
}

export const SandpackLayout = React.forwardRef<
  HTMLDivElement,
  SandpackLayoutProps
>(({ children, className, ...props }, ref) => {
  const { sandpack } = useSandpack();
  const classNames = useClassNames();
  const combinedRef = useCombinedRefs(sandpack.lazyAnchorRef, ref);

  return (
    <div
      ref={combinedRef}
      className={classNames("layout", [layoutClassName, className])}
      {...props}
    >
      {children}
    </div>
  );
});

SandpackLayout.displayName = "SandpackLayout";
