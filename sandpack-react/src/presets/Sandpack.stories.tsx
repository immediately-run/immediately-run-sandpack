import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import React from "react";

import { Sandpack } from "../";
import { REACT_TEMPLATE } from "../templates";
import { useSandpackFS } from "../utils/storyHelpers";

export default {
  title: "presets/Sandpack: options",
  component: Sandpack,
};

export const Main: React.FC = () => {
  const fs = useSandpackFS({
    template: "react",
    files: {
      "/App.js": `import Button from './button';
import Link from './link';

export default function App() {
  return (
    <div>
      <h1>Hello world</h1>
      <Button />
      <Link />
    </div>
  )
}`,
      "/button.js": `export default function Button() {
  return <button>Click me</button>
}
`,
      "/link.js": `export default function Link() {
  return <a href="https://www.example.com" target="_blank">Click Here</a>
}`,
    },
  });
  if (!fs) return null;
  return (
    <Sandpack
      fs={fs}
      options={{
        showLineNumbers: true,
        showInlineErrors: true,
      }}
    />
  );
};

export const Layout: React.FC = () => {
  const fsNode = useSandpackFS({ template: "node" });
  const fsTestTs = useSandpackFS({ template: "test-ts" });
  const fsReact = useSandpackFS({ template: "react" });
  if (!fsNode || !fsTestTs || !fsReact) return null;
  return (
    <>
      <p>Console</p>
      <Sandpack fs={fsNode} options={{ layout: "console" }} />

      <p>Tests</p>
      <Sandpack fs={fsTestTs} options={{ layout: "tests" }} />

      <p>Preview</p>
      <Sandpack fs={fsReact} options={{ layout: "preview" }} />
    </>
  );
};

export const CustomSetup: React.FC = () => {
  const fs = useSandpackFS({
    customSetup: {
      entry: "/src/index.tsx",
      dependencies: {
        react: "latest",
        "react-dom": "latest",
        "react-scripts": "4.0.0",
      },
    },
    files: {
      "./tsconfig.json": {
        code: `{
"include": [
  "./src/**/*"
],
"compilerOptions": {
  "strict": true,
  "esModuleInterop": true,
  "lib": [
    "dom",
    "es2015"
  ],
  "jsx": "react"
}
}`,
        hidden: true,
      },
      "/public/index.html": {
        code: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<body>
<div id="root"></div>
</body>
</html>`,
        hidden: true,
      },
      "/src/index.tsx": {
        code: `import * as React from "react";
import { render } from "react-dom";

import { Main } from "./main";

const rootElement = document.getElementById("root");
render(<Main test="World"/>, rootElement);
        `,
        hidden: true,
      },
      "/src/main.tsx": {
        code: `import * as React from "react";

export const Main: React.FC<{test: string}> = ({test}) => {
  return (
    <h1>Hello {test}</h1>
  )
}`,
      },
    },
  });
  if (!fs) return null;
  return (
    <Sandpack
      fs={fs}
      options={{ wrapContent: true, activeFile: "/src/main.tsx" }}
      theme="dark"
    />
  );
};

export const ExternalResources: React.FC = () => {
  const fs = useSandpackFS({
    template: "react",
    files: {
      "/App.js": `export default () => {
  return <a
    href="#"
    className="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100"
  >
    Log in
  </a>
}`,
    },
  });
  if (!fs) return null;
  return (
    <Sandpack
      fs={fs}
      options={{
        externalResources: [
          "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
        ],
      }}
    />
  );
};

export const AutoRun = (): React.ReactElement | null => {
  const fs = useSandpackFS({
    template: "react",
    files: {
      "/App.js": `export default function Kitten() {
  return (
    <img src="https://placekitten.com/200/250" alt="Kitten" />
  );
}`,
    },
  });
  if (!fs) return null;
  return (
    <Sandpack
      fs={fs}
      options={{
        autorun: false,
        showTabs: true,
        showLineNumbers: true,
        showNavigator: true,
      }}
    />
  );
};

export const AutoReload = (): React.ReactElement | null => {
  const fs = useSandpackFS({
    template: "react",
    files: {
      "/App.js": `export default function Kitten() {
  return (
    <img src="https://placekitten.com/200/250" alt="Kitten" />
  );
}`,
    },
  });
  if (!fs) return null;
  return (
    <Sandpack
      fs={fs}
      options={{
        autorun: true,
        autoReload: false,
      }}
    />
  );
};

export const InitModeUserVisible: React.FC = () => {
  const fs = useSandpackFS();
  if (!fs) return null;
  return (
    <>
      {new Array(30).fill(" ").map((_, index) => {
        return (
          <div key={index} style={{ marginBottom: 200 }}>
            <Sandpack fs={fs} options={{ initMode: "user-visible" }} />
          </div>
        );
      })}
    </>
  );
};

export const ShowLineNumber: React.FC = () => {
  const fs = useSandpackFS({ template: "react" });
  if (!fs) return null;
  return <Sandpack fs={fs} options={{ showLineNumbers: true }} />;
};

export const wrapContent: React.FC = () => {
  const fs = useSandpackFS({ template: "vanilla" });
  if (!fs) return null;
  return <Sandpack fs={fs} options={{ wrapContent: true }} />;
};

const defaultFiles = {
  "/styles.css": `body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: auto;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

h1 {
  font-size: 1.5rem;
}`,
  "/index.js": `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
  "/package.json": `{
  "name": "test-sandbox",
  "main": "/index.js",
  "private": true,
  "scripts": {},
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-scripts": "^4.0.0"
  }
}
`,
};

const filesA = {
  "/App.js": `import "./styles.css";

export default function App() {
  return <h1>File A</h1>
}`,
};

const filesB = {
  "/App.js": `import "./styles.css";

export default function App() {
  return <h1>File B</h1>
}`,
};

/**
 * Previously this story demonstrated the `options.fileResolver` escape
 * hatch. That hook is gone: Sandpack now owns the files through a
 * {@link SandpackFS}. Any external file providers should either seed the
 * filesystem via the `files` prop or mount a custom ZenFS backend and
 * hand the result in via `fs={...}`.
 */
export const FileResolver = (): JSX.Element | null => {
  const fs = useSandpackFS({
    customSetup: { environment: "create-react-app", entry: "/index.js" },
    files: { ...defaultFiles, ...filesA, ...filesB },
  });
  if (!fs) return null;
  return (
    <Sandpack
      fs={fs}
      options={{ bundlerURL: "https://sandpack-bundler.codesandbox.io" }}
    />
  );
};

export const ShowConsoleButton: React.FC = () => {
  const fs = useSandpackFS({
    template: "react",
    files: {
      "/index.js": `${REACT_TEMPLATE.files["/index.js"].code};

        console.error("Something went wrong");

        console.log(function helloWord() {})
        `,
    },
  });
  if (!fs) return null;
  return (
    <div style={{ width: 800 }}>
      <Sandpack
        fs={fs}
        options={{
          showConsoleButton: true,
          showConsole: true,
        }}
      />
    </div>
  );
};

export const CustomLanguages: React.FC = () => {
  const fs = useSandpackFS({
    customSetup: {
      entry: "/example.sh",
    },
    files: {
      "/example.sh": `#!/bin/sh

EXAMPLE="drawn joyed"

# Prints the EXAMPLE variable
function show-example() {
  echo $EXAMPLE
}`,
      "/example.bat": `@echo off

Rem Prints the "example" variable

set example=Hello world

echo %example%`,
      "/example.ps1": `$example = "Hello world"

# Prints the "example" variable

Write-Output $example`,
    },
  });
  if (!fs) return null;
  return (
    <Sandpack
      fs={fs}
      options={{
        codeEditor: {
          additionalLanguages: [
            {
              name: "shell",
              extensions: ["sh", "bat", "ps1"],
              language: new LanguageSupport(StreamLanguage.define(shell)),
            },
          ],
        },
      }}
    />
  );
};

export const RtlLayout: React.FC = () => {
  const fs = useSandpackFS({ template: "react" });
  if (!fs) return null;
  return (
    <>
      <Sandpack fs={fs} options={{ rtl: true }} />
    </>
  );
};
