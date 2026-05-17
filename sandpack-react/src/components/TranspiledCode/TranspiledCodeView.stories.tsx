import * as React from "react";

import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackCodeEditor } from "../CodeEditor";
import { SandpackLayout } from "../common/Layout";
import { useSandpackFS } from "../../utils/storyHelpers";

import { SandpackTranspiledCode } from "./index";

export default {
  title: "components/Transpiled Code View",
};

export const Component: React.FC = () => {
  const fs = useSandpackFS({
    customSetup: {
      entry: "/index.js",
      dependencies: { "@babel/runtime": "latest" },
    },
    files: {
      "/index.js": {
        code: `const text = 'Hello world!'
const str = \`<div>\${text}</div>\`
`,
      },
    },
  });
  if (!fs) return null;
  return (
    <SandpackProvider fs={fs}>
      <SandpackLayout>
        <SandpackCodeEditor />
        <SandpackTranspiledCode />
      </SandpackLayout>
    </SandpackProvider>
  );
};
