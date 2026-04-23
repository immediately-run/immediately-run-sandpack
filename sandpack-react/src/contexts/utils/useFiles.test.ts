/**
 * @jest-environment jsdom
 */
import { renderHook, act, waitFor } from "@testing-library/react";

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
  it("exposes the default template's visible file once initialized", async () => {
    const { result } = renderHook(() => useFiles({}));

    await waitForReady(() => result.current[0]);

    expect(result.current[0].activeFile).toBeTruthy();
    expect(result.current[0].fileList.length).toBeGreaterThan(0);
  });

  it("adds a new file", async () => {
    const { result } = renderHook(() => useFiles({}));
    await waitForReady(() => result.current[0]);

    await act(async () => {
      await result.current[1].addFile("/App.js", "new-content");
    });

    await waitFor(() =>
      expect(result.current[0].fileList).toContain("/App.js"),
    );
    expect(await result.current[0].fs.readFile("/App.js")).toBe("new-content");
  });

  it("deletes a file", async () => {
    const { result } = renderHook(() => useFiles({}));
    await waitForReady(() => result.current[0]);

    expect(result.current[0].fileList).toContain("/index.js");

    await act(async () => {
      await result.current[1].deleteFile("/index.js");
    });

    await waitFor(() =>
      expect(result.current[0].fileList).not.toContain("/index.js"),
    );
  });

  it("deletes the activeFile and set the following visibleFile as active", async () => {
    const { result } = renderHook(() =>
      useFiles({
        template: "react",
        options: { activeFile: "/App.js", visibleFiles: ["/styles.css"] },
      }),
    );

    await waitForReady(() => result.current[0]);

    await act(async () => {
      await result.current[1].deleteFile("/App.js");
    });

    expect(result.current[0].activeFile).toBe("/styles.css");
  });

  it("updates a file", async () => {
    const { result } = renderHook(() => useFiles({ template: "react" }));
    await waitForReady(() => result.current[0]);

    await act(async () => {
      await result.current[1].updateFile("/App.js", "Foo");
    });

    expect(await result.current[0].fs.readFile("/App.js")).toBe("Foo");
  });

  it("updates multiples files", async () => {
    const { result } = renderHook(() => useFiles({ template: "react" }));
    await waitForReady(() => result.current[0]);

    await act(async () => {
      await result.current[1].updateFile({
        "/App.js": "Foo",
        "/index.js": "Baz",
      });
    });

    expect(await result.current[0].fs.readFile("/App.js")).toBe("Foo");
    expect(await result.current[0].fs.readFile("/index.js")).toBe("Baz");
  });

  it("preserves per-file metadata on subsequent updates", async () => {
    const { result } = renderHook(() =>
      useFiles({
        template: "react",
        files: {
          "/App.js": {
            code: "export default function App() { return <h1>Hello world</h1>}",
            readOnly: true,
          },
        },
      }),
    );

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
  }, 10000);
});
