/**
 * @jest-environment jsdom
 */
import { renderHook, act, waitFor } from "@testing-library/react";

import { createSandpackFS } from "../../utils/createSandpackFS";
import { useFiles } from "./useFiles";

/**
 * Helper: wait for the async fs init to land and `isLoading` to flip false.
 */
async function waitForReady<T extends { isLoading: boolean }>(
  get: () => T,
): Promise<void> {
  await waitFor(() => expect(get().isLoading).toBe(false));
}

describe(useFiles, () => {
  it("exposes the visible file once initialized", async () => {
    const fs = await createSandpackFS({ template: "vanilla" });
    const { result } = renderHook(() => useFiles({ fs }));

    await waitForReady(() => result.current[0]);

    expect(result.current[0].activeFile).toBeTruthy();
    expect(result.current[0].fileList.length).toBeGreaterThan(0);
    fs.dispose();
  });

  it("adds a new file", async () => {
    const fs = await createSandpackFS({ template: "vanilla" });
    const { result } = renderHook(() => useFiles({ fs }));
    await waitForReady(() => result.current[0]);

    await act(async () => {
      await result.current[1].addFile("/App.js", "new-content");
    });

    await waitFor(() =>
      expect(result.current[0].fileList).toContain("/App.js"),
    );
    expect(await result.current[0].fs.readFile("/App.js")).toBe("new-content");
    fs.dispose();
  });

  it("deletes a file", async () => {
    const fs = await createSandpackFS({ template: "vanilla" });
    const { result } = renderHook(() => useFiles({ fs }));
    await waitForReady(() => result.current[0]);

    expect(result.current[0].fileList).toContain("/index.js");

    await act(async () => {
      await result.current[1].deleteFile("/index.js");
    });

    await waitFor(() =>
      expect(result.current[0].fileList).not.toContain("/index.js"),
    );
    fs.dispose();
  });

  it("deletes the activeFile and set the following visibleFile as active", async () => {
    const fs = await createSandpackFS({
      template: "react",
    });
    const { result } = renderHook(() =>
      useFiles({
        fs,
        options: { activeFile: "/App.js", visibleFiles: ["/styles.css"] },
      }),
    );

    await waitForReady(() => result.current[0]);

    await act(async () => {
      await result.current[1].deleteFile("/App.js");
    });

    expect(result.current[0].activeFile).toBe("/styles.css");
    fs.dispose();
  });

  it("updates a file", async () => {
    const fs = await createSandpackFS({ template: "react" });
    const { result } = renderHook(() => useFiles({ fs }));
    await waitForReady(() => result.current[0]);

    await act(async () => {
      await result.current[1].updateFile("/App.js", "Foo");
    });

    expect(await result.current[0].fs.readFile("/App.js")).toBe("Foo");
    fs.dispose();
  });

  it("preserves per-file metadata on subsequent updates", async () => {
    const fs = await createSandpackFS({
      template: "react",
      files: {
        "/App.js": {
          code: "export default function App() { return <h1>Hello world</h1>}",
          readOnly: true,
        },
      },
    });

    const { result } = renderHook(() => useFiles({ fs }));

    await waitForReady(() => result.current[0]);

    await act(async () => {
      await result.current[1].updateFile("/App.js", "console.log(10)");
    });

    expect(await result.current[0].fs.readFile("/App.js")).toBe(
      "console.log(10)",
    );
    expect(result.current[0].fs.getMetadata("/App.js")).toEqual({
      readOnly: true,
    });
    fs.dispose();
  }, 10000);
});
