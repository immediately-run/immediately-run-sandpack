/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import type { Story } from "@storybook/react";
import * as React from "react";

import { Sandpack } from "../../";
import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackThemeProvider } from "../../styles/themeContext";
import { SandpackPreview } from "../Preview";
import { useSandpackFS } from "../../utils/storyHelpers";

import type { CodeEditorProps } from "./";
import { SandpackCodeEditor } from "./";

export default {
  title: "components/Code Editor",
  component: SandpackCodeEditor,
};

export const Component: Story<CodeEditorProps> = (args) => {
  const fs = useSandpackFS({
    customSetup: { entry: "/index.js" },
    files: {
      "/index.js": {
        code: 'const title = "This is a simple code editor"',
      },
    },
  });
  if (!fs) return null;
  return (
    <SandpackProvider fs={fs}>
      <SandpackThemeProvider>
        <SandpackCodeEditor {...args} />
      </SandpackThemeProvider>
    </SandpackProvider>
  );
};

export const ShowTabs: Story<CodeEditorProps> = (args) => {
  const fs = useSandpackFS({
    customSetup: { entry: "/index.js" },
    files: {
      "/index.js": {
        code: 'const title = "This is a simple code editor"',
      },
    },
  });
  if (!fs) return null;
  return (
    <SandpackProvider fs={fs}>
      <SandpackThemeProvider>
        <SandpackCodeEditor showTabs {...args} />
      </SandpackThemeProvider>
    </SandpackProvider>
  );
};

export const InlineError: React.FC = () => {
  const fs = useSandpackFS({
    template: "react",
    files: {
      "/App.js": `export default function App()
  return <h1>Hello world</h1>
}`,
    },
  });
  if (!fs) return null;
  return (
    <SandpackProvider fs={fs}>
      <SandpackThemeProvider>
        <SandpackCodeEditor showInlineErrors showLineNumbers />
        <SandpackPreview />
      </SandpackThemeProvider>
    </SandpackProvider>
  );
};

export const ClosableTabs: React.FC = () => {
  const fs = useSandpackFS({ template: "react" });
  if (!fs) return null;
  return (
    <SandpackProvider
      fs={fs}
      options={{ visibleFiles: ["/App.js", "/index.js", "/styles.css"] }}
      theme="dark"
    >
      <SandpackCodeEditor closableTabs />
    </SandpackProvider>
  );
};

export const ExtensionAutocomplete: React.FC = () => {
  const [active, setActive] = React.useState(false);
  const fs = useSandpackFS({ template: "react" });
  if (!fs) return null;
  return (
    <>
      <button onClick={(): void => setActive((prev): boolean => !prev)}>
        Toggle
      </button>
      <SandpackProvider fs={fs}>
        <SandpackThemeProvider>
          <SandpackCodeEditor
            extensions={active ? [autocompletion()] : []}
            extensionsKeymap={active ? [completionKeymap] : []}
            id="extensions"
          />
        </SandpackThemeProvider>
      </SandpackProvider>
    </>
  );
};

export const ReadOnly: React.FC = () => {
  const fs1 = useSandpackFS({
    template: "react-ts",
    customSetup: { entry: "/index.tsx" },
    files: {
      "/index.tsx": { code: "", hidden: true },
      "/App.tsx": { code: "Hello", readOnly: true, active: true },
      "/src/components/button.tsx": { code: "World", readOnly: false },
    },
  });
  const fs2 = useSandpackFS({ template: "react-ts" });
  const fs3 = useSandpackFS({
    template: "react-ts",
    files: {
      "/index.tsx": { code: "", hidden: true },
      "/src/App.tsx": { code: "Hello", readOnly: true },
      "/src/components/button.tsx": { code: "World", readOnly: false },
    },
  });
  const fs4 = useSandpackFS({
    template: "react-ts",
    files: {
      "/index.tsx": { code: "", hidden: true },
      "/src/App.tsx": { code: "Hello", readOnly: true },
      "/src/components/button.tsx": { code: "World", readOnly: false },
    },
  });
  const fs5 = useSandpackFS({
    template: "react-ts",
    files: {
      "/index.tsx": { code: "", hidden: true },
      "/src/App.tsx": { code: "Hello", readOnly: true, active: true },
      "/src/components/button.tsx": { code: "World", readOnly: false },
    },
  });

  if (!fs1 || !fs2 || !fs3 || !fs4 || !fs5) return null;
  return (
    <>
      <p>Read-only by file</p>
      <Sandpack
        fs={fs1}
        options={{ showTabs: true, activeFile: "/App.tsx" }}
      />

      <p>Read-only global</p>
      <Sandpack fs={fs2} options={{ showTabs: true, readOnly: true }} />

      <p>Read-only global and by file</p>
      <Sandpack fs={fs3} options={{ showTabs: false, readOnly: true }} />

      <p>Read-only global, but no label</p>
      <Sandpack
        fs={fs4}
        options={{ showTabs: false, readOnly: true, showReadOnly: false }}
      />

      <p>Read-only by file, but no label</p>
      <Sandpack
        fs={fs5}
        options={{ showTabs: true, readOnly: false, showReadOnly: false }}
      />
    </>
  );
};
