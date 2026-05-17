import React from "react";

import { SandpackPreview } from "..";
import { SandpackProvider, SandpackLayout, SandpackThemeProvider } from "../..";
import { useSandpackFS } from "../../utils/storyHelpers";

import { SandpackReactDevTools } from "./";

export default {
  title: "components/ReactDevTools",
};

export const ReactDevTool: React.FC = () => {
  const fs = useSandpackFS({
    template: "react",
    files: {
      "/App.js": `
const Container = ({children}) => <div>{children}</div>
const Button = () => <p>Button</p>

export default function App() {
return (
<Container>
  <div>
    <Button />
    <Button />
    <h1>Hello world</h1>
    <Button />
  </div>
</Container>
)
}
      `,
    },
  });
  if (!fs) return null;
  return (
    <SandpackProvider fs={fs}>
      <SandpackThemeProvider>
        <SandpackLayout>
          <SandpackPreview />
          <SandpackReactDevTools style={{ width: "50%" }} />
        </SandpackLayout>
      </SandpackThemeProvider>
    </SandpackProvider>
  );
};
