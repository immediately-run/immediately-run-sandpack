import React from "react";

import { SandpackPreview } from "../components/Preview";
import { SandpackLayout } from "../components/common/Layout";
import { SandpackProvider } from "../contexts/sandpackContext";
import { useSandpackFS } from "../utils/storyHelpers";

import { useSandpackNavigation } from "./useSandpackNavigation";

export default {
  title: "hooks/useSandpackNavigation",
};

const CustomRefreshButton: React.FC = () => {
  const { refresh } = useSandpackNavigation();
  return (
    <button onClick={refresh} type="button">
      Refresh
    </button>
  );
};

export const CustomCodeEditor = (): React.ReactElement | null => {
  const fs = useSandpackFS({ template: "react" });
  if (!fs) return null;
  return (
    <SandpackProvider fs={fs}>
      <SandpackLayout>
        <SandpackPreview showRefreshButton={false} />
      </SandpackLayout>
      <CustomRefreshButton />
    </SandpackProvider>
  );
};
