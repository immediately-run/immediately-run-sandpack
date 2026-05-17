import * as React from "react";

import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackCodeViewer } from "../CodeViewer";
import { SandpackLayout } from "../common/Layout";
import { useSandpackFS } from "../../utils/storyHelpers";

import { FileTabs } from "./index";

export default {
  title: "components/File Tabs",
};

export const Component: React.FC = () => {
  const fs = useSandpackFS({
    customSetup: {
      entry: "/index.tsx",
    },
    files: {
      "/index.tsx": "",
      "/src/app.tsx": { code: "", active: true },
      "/src/components/button.tsx": "",
    },
  });
  if (!fs) return null;
  return (
    <SandpackProvider fs={fs}>
      <SandpackLayout>
        <FileTabs />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export const WithClosableTabs: React.FC = () => {
  const fs = useSandpackFS({
    customSetup: {
      entry: "/index.tsx",
    },
    files: {
      "/index.tsx": { code: "", hidden: true },
      "/src/app.tsx": "Hello",
      "/src/components/button.tsx": "World",
    },
  });
  if (!fs) return null;
  return (
    <SandpackProvider fs={fs}>
      <SandpackLayout>
        <FileTabs closableTabs />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export const WithHiddenFiles: React.FC = () => {
  const fs = useSandpackFS({
    customSetup: {
      entry: "/index.tsx",
    },
    files: {
      "/index.tsx": { code: "", hidden: true },
      "/src/app.tsx": "Hello",
      "/src/components/button.tsx": "World",
    },
  });
  if (!fs) return null;
  return (
    <SandpackProvider fs={fs}>
      <SandpackLayout>
        <SandpackCodeViewer />
      </SandpackLayout>
    </SandpackProvider>
  );
};
