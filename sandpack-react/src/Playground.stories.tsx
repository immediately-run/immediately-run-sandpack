/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackProvider,
} from "./";
import { useSandpackFS } from "./utils/storyHelpers";

export default {
  title: "Intro/Playground",
};

export const Basic: React.FC = () => {
  const fs = useSandpackFS();
  if (!fs) return null;
  return (
    <div style={{ height: "400vh" }}>
      <SandpackProvider fs={fs}>
        <SandpackLayout>
          <SandpackFileExplorer />
          <SandpackCodeEditor closableTabs showTabs />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};
