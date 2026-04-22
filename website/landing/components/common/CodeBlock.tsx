import {
  SandpackCodeViewer,
  SandpackProvider,
  SandpackThemeProvider,
} from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";

import { codeBlockClassName } from "./CodeBlock.css";

export const CodeBlock: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className={codeBlockClassName}>
      <SandpackProvider>
        <SandpackThemeProvider theme={sandpackDark}>
          <SandpackCodeViewer code={(children as string)?.trim()} />
        </SandpackThemeProvider>
      </SandpackProvider>
    </div>
  );
};
