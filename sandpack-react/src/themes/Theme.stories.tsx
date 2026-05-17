import { storiesOf } from "@storybook/react";
import React from "react";
import { useState } from "react";

import { Sandpack } from "../";
import { useSandpackFS } from "../utils/storyHelpers";

import { SANDPACK_THEMES, defaultLight, defaultDark } from ".";

const stories = storiesOf("presets/Themes", module);

Object.keys(SANDPACK_THEMES).forEach((themeName) =>
  stories.add(themeName, () => {
    const fs = useSandpackFS({ template: "react" });
    if (!fs) return null;
    return (
      <Sandpack
        fs={fs}
        options={{
          showLineNumbers: true,
          showInlineErrors: true,
          showNavigator: true,
          showTabs: true,
        }}
        theme={themeName as keyof typeof SANDPACK_THEMES}
      />
    );
  }),
);

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState("light");
  const fs = useSandpackFS({ template: "react" });
  if (!fs) return null;

  return (
    <div>
      <select onChange={(e) => setTheme(e.target.value)} value={theme}>
        <option value="light">light</option>
        <option value="dark">dark</option>
      </select>
      <Sandpack
        fs={fs}
        options={{
          showLineNumbers: true,
          showInlineErrors: true,
          showNavigator: true,
          showTabs: true,
        }}
        theme={theme === "light" ? defaultLight : defaultDark}
      />
    </div>
  );
};

stories.add("theme-switcher", () => <ThemeSwitcher />);
