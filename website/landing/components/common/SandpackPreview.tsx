import { Sandpack } from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";

import { styled } from "../../styles/styled";

import { sandpackContainerClassName } from "./SandpackPreview.css";

export const SandpackContainer = styled("div", sandpackContainerClassName);

export const SandpackPreview: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any;
}> = ({ options }) => {
  return (
    <SandpackContainer>
      <Sandpack
        template="react"
        theme={sandpackDark}
        {...options}
        options={{
          initMode: "user-visible",
          ...(options?.options ?? {}),
          classes: {
            "sp-layout": "custom-layout",
            "sp-stack": "custom-stack",
            "sp-wrapper": "custom-wrapper",
          },
        }}
      />
    </SandpackContainer>
  );
};
