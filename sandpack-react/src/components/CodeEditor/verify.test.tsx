/**
 * @jest-environment jsdom
 */
import { render, waitFor, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { SandpackFS } from "@immediately-run/sandpack-client";
import React from "react";

import { SandpackProvider } from "../../";
import { SandpackFileExplorer } from "../FileExplorer";
import { useActiveCode } from "../../hooks/useActiveCode";
import { useSandpack } from "../../hooks/useSandpack";
import { createSandpackFS } from "../../utils/createSandpackFS";

if (typeof (global as any).structuredClone === "undefined") {
  (global as any).structuredClone = (v: unknown) =>
    v === undefined ? undefined : JSON.parse(JSON.stringify(v));
}

const Probe: React.FC = () => {
  const { code } = useActiveCode();
  const { sandpack } = useSandpack();
  return (
    <div data-testid="probe" data-active={sandpack.activeFile}>
      {code}
    </div>
  );
};
const snap = () => {
  const el = document.querySelector('[data-testid="probe"]') as HTMLElement;
  return {
    active: el?.getAttribute("data-active") ?? "",
    code: el?.textContent ?? "",
  };
};

describe("SandpackCodeEditor loads file content from ZenFS", () => {
  let fs: SandpackFS;
  let appJs: string;
  let stylesCss: string;
  beforeAll(async () => {
    fs = await createSandpackFS({ template: "react" });
    appJs = await fs.readFile("/App.js");
    stylesCss = await fs.readFile("/styles.css");
  });

  it("shows the active file on load and the clicked file on selection", async () => {
    render(
      <SandpackProvider fs={fs}>
        <SandpackFileExplorer />
        <Probe />
      </SandpackProvider>,
    );

    // Initial active file must be a real file (not the internal /.sandpack
    // metadata directory) and its ZenFS content must be displayed.
    await waitFor(() => {
      expect(snap().active).toBe("/App.js");
      expect(snap().code).toEqual(appJs);
    });

    // Clicking a different file in the explorer loads ITS content.
    const btn = (
      Array.from(
        document.querySelectorAll("button[title]"),
      ) as HTMLButtonElement[]
    ).find((b) => /styles\.css$/.test(b.title));
    if (!btn) throw new Error("styles.css button not found");
    fireEvent.click(btn);

    await waitFor(() => {
      expect(snap().active).toBe("/styles.css");
      expect(snap().code).toEqual(stylesCss);
    });

    // An external write to the active file refreshes the editor, and the
    // deferred re-read observes the *completed* write (no torn mid-write
    // content), regardless of whether the new content is shorter or longer
    // than the previous content.
    //
    // "External" is a defined term since 727504c ("zenfs editing fixes",
    // 2026-05-27 — one day AFTER this test): the editor re-reads only on
    // changes relayed from the child iframe, i.e. `handleRemoteChange(path)`
    // after the bytes landed in the shared store (the Port backend forwards no
    // watch events, which is why the relay exists). A bare `fs.writeFile` is a
    // LOCAL write and must NOT refresh — that suppression is what keeps typing
    // echo-free. This test predates the split and drove the local path; it now
    // drives the production one (write, then relay — the shape of site-main's
    // useLocalLiveUpdates.ts, which relays host-observed writes into
    // sandpackFS.handleRemoteChange(path)) and additionally pins the no-echo
    // half of the contract.
    const shorter = "x";
    await act(async () => {
      await fs.writeFile("/styles.css", shorter);
    });
    // No relay yet: a local write alone must not touch the editor buffer.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });
    expect(snap().code).toEqual(stylesCss);
    act(() => {
      fs.handleRemoteChange("/styles.css");
    });
    await waitFor(() => {
      expect(snap().code).toEqual(shorter);
    });

    const longer = stylesCss + "\n/* appended */\n";
    await act(async () => {
      await fs.writeFile("/styles.css", longer);
    });
    act(() => {
      fs.handleRemoteChange("/styles.css");
    });
    await waitFor(() => {
      expect(snap().code).toEqual(longer);
    });
  });
});
