/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from "react";

import { SandpackCodeEditor } from "../../components/CodeEditor";
import { SandpackProvider } from "../../contexts/sandpackContext";
import { useSandpackFS } from "../../utils/storyHelpers";
import { SandpackLayout } from "../common/Layout";

import { Directory } from "./Directory";
import { File } from "./File";

import { SandpackFileExplorer } from "./";

export default {
  title: "components/File Explorer",
};

export const Component: React.FC = () => {
  const fs1 = useSandpackFS({
    customSetup: { entry: "/index.tsx" },
    files: {
      "/index.tsx": "",
      "/src/app.tsx": "",
      "/src/components/button.tsx": "",
    },
  });
  const fs2 = useSandpackFS({
    customSetup: { entry: "/index.tsx" },
    files: {
      "/index.tsx": "",
      "/src/app.tsx": "",
      "/src/components/button.tsx": "",
      "/src/components/really-loooooooong-naaameeee.tsx": "",
    },
  });
  if (!fs1 || !fs2) return null;
  return (
    <>
      <SandpackProvider fs={fs1}>
        <SandpackLayout>
          <SandpackFileExplorer />
          <SandpackCodeEditor closableTabs />
        </SandpackLayout>
      </SandpackProvider>

      <SandpackProvider fs={fs2} theme="dark">
        <SandpackLayout>
          <SandpackFileExplorer />
          <SandpackCodeEditor closableTabs />
        </SandpackLayout>
      </SandpackProvider>
    </>
  );
};

export const InitialCollapsedFolder: React.FC = () => {
  const fs1 = useSandpackFS({
    customSetup: { entry: "/index.tsx" },
    files: {
      "/index.tsx": "",
      "/src/app.tsx": "",
      "/src/components/button.tsx": "",
    },
  });
  const fs2 = useSandpackFS({
    customSetup: { entry: "/index.tsx" },
    files: {
      "/index.tsx": "",
      "/src/app.tsx": "",
      "/src/components/button.tsx": "",
      "/src/components/really-loooooooong-naaameeee.tsx": "",
    },
  });
  if (!fs1 || !fs2) return null;
  return (
    <>
      <SandpackProvider fs={fs1}>
        <SandpackLayout>
          <SandpackFileExplorer initialCollapsedFolder={["/src/components/"]} />
          <SandpackCodeEditor closableTabs />
        </SandpackLayout>
      </SandpackProvider>

      <SandpackProvider fs={fs2} theme="dark">
        <SandpackLayout>
          <SandpackFileExplorer initialCollapsedFolder={["/src/components/"]} />
        </SandpackLayout>
      </SandpackProvider>
    </>
  );
};

export const LongFileTree: React.FC = () => {
  const files = new Array(20)
    .fill(" ")
    .reduce((acc: Record<string, string>, _curr: unknown, index: number) => {
      acc[`/src/com${index}.js`] = "";
      return acc;
    }, {});
  const fs = useSandpackFS({
    customSetup: { entry: "/src/com0.js" },
    files,
  });
  if (!fs) return null;
  return (
    <SandpackProvider fs={fs}>
      <SandpackLayout>
        <SandpackFileExplorer />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export const FileStory: React.FC = () => {
  const fs = useSandpackFS();
  if (!fs) return null;
  return (
    <SandpackProvider fs={fs}>
      <SandpackLayout>
        <File depth={1} path="file.ts" />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export const DirectoryIconStory: React.FC = () => {
  const fs = useSandpackFS();
  if (!fs) return null;
  return (
    <SandpackProvider fs={fs}>
      <SandpackLayout>
        <Directory
          activeFile="file.ts"
          depth={1}
          files={{ App: { code: "" } }}
          prefixedPath="/src"
          selectFile={(): void => {
            //
          }}
          visibleFiles={[]}
        />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export const AutoHiddenFiles = (): JSX.Element | null => {
  const [visibleFiles, setVisibleFiles] = React.useState([
    "/src/index.js",
    "/hidden.js",
  ]);

  const changeVisibleFiles = (): void => {
    if (!visibleFiles.includes("/index2.js")) {
      setVisibleFiles((prevVisibleFiles) => [
        ...prevVisibleFiles,
        "/index2.js",
      ]);
    }
  };

  const fs1 = useSandpackFS({
    template: "vanilla",
    customSetup: { entry: "/index.js" },
    files: {
      "/index.js": { code: "// filename: index.js", active: true },
      "/index2.js": { code: "// filename: index2.js" },
      "/src/index.js": { code: "// filename: src/index.js", hidden: true },
      "/hidden.js": { code: "// filename: hidden.js", hidden: true },
    },
  });
  const fs2 = useSandpackFS({
    template: "vanilla",
    customSetup: { entry: "/index.js" },
    files: {
      "/index.js": { code: "// filename: index.js", active: true },
      "/index2.js": { code: "// filename: index2.js" },
      "/src/index.js": { code: "// filename: src/index.js", hidden: true },
      "/hidden.js": { code: "// filename: hidden.js", hidden: true },
    },
  });

  if (!fs1 || !fs2) return null;

  return (
    <>
      <button onClick={changeVisibleFiles}>change visible files prop</button>

      <SandpackProvider
        fs={fs1}
        options={{
          // @ts-ignore
          visibleFiles,
          activeFile: "/src/index.js",
        }}
      >
        <SandpackLayout>
          <SandpackFileExplorer autoHiddenFiles />
          <SandpackCodeEditor closableTabs />
        </SandpackLayout>
      </SandpackProvider>

      <br />
      <hr />
      <br />

      <SandpackProvider fs={fs2}>
        <SandpackLayout>
          <SandpackFileExplorer autoHiddenFiles />
          <SandpackCodeEditor closableTabs />
        </SandpackLayout>
      </SandpackProvider>
    </>
  );
};
