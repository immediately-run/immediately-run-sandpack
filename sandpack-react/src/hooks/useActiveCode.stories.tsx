import React from "react";

import { SandpackPreview } from "../components/Preview";
import { SandpackLayout } from "../components/common/Layout";
import { SandpackProvider } from "../contexts/sandpackContext";
import { useSandpackFS } from "../utils/storyHelpers";

import { useActiveCode } from "./useActiveCode";

export default {
  title: "hooks/useActiveCode",
};

const CustomEditor: React.FC = () => {
  const { code, updateCode } = useActiveCode();
  return (
    <textarea onChange={(evt): void => updateCode(evt.target.value)}>
      {code}
    </textarea>
  );
};

export const CustomCodeEditor = (): React.ReactElement | null => {
  const fs = useSandpackFS({ template: "react" });
  if (!fs) return null;
  return (
    <SandpackProvider fs={fs}>
      <SandpackLayout>
        <CustomEditor />
        <SandpackPreview />
      </SandpackLayout>
    </SandpackProvider>
  );
};
