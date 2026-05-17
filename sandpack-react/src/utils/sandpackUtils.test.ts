/**
 * @jest-environment jsdom
 */
import { createSandpackFS, resolveFile } from "./createSandpackFS";

describe(resolveFile, () => {
  it("resolves the file path based on the extension", () => {
    const data = resolveFile("/file.js", { "/file.ts": "" });
    expect(data).toBe("/file.ts");
  });

  it("adds the leading slash and resolves the file path", () => {
    const data = resolveFile("file.js", { "/file.js": "" });
    expect(data).toBe("/file.js");
  });

  it("resolves the file path without leading slash", () => {
    const data = resolveFile("file.ts", { "/file.js": "" });
    expect(data).toBe("/file.js");
  });

  it("fixes (add/remove) the leading slash and fixes the extension", () => {
    const data = resolveFile("/file.ts", { "/file.js": "" });
    expect(data).toBe("/file.js");
  });

  it("resolves a file regardless the file extension", () => {
    const data = resolveFile("file.sh", { "/file.sh": "" });
    expect(data).toBe("/file.sh");
  });
});

describe(createSandpackFS, () => {
  it("creates an FS from a template and returns it with files", async () => {
    const fs = await createSandpackFS({ template: "react" });
    const paths = await fs.list();
    expect(paths.length).toBeGreaterThan(0);
    expect(paths).toContain("/App.js");
    fs.dispose();
  });

  it("stores the environment on the FS", async () => {
    const fs = await createSandpackFS({ template: "react" });
    expect(fs.getEnvironment()).toBe("create-react-app");
    fs.dispose();
  });

  it("stores the mode on the FS for test-ts template", async () => {
    const fs = await createSandpackFS({ template: "test-ts" });
    expect(fs.getMode()).toBe("tests");
    fs.dispose();
  });

  it("merges template and user files", async () => {
    const fs = await createSandpackFS({
      template: "react",
      files: { "/foo.ts": "foo" },
    });
    const paths = await fs.list();
    expect(paths).toContain("/foo.ts");
    expect(await fs.readFile("/foo.ts")).toBe("foo");
    fs.dispose();
  });

  it("user files override template files", async () => {
    const fs = await createSandpackFS({
      template: "react",
      files: { "/App.js": "overridden" },
    });
    expect(await fs.readFile("/App.js")).toBe("overridden");
    fs.dispose();
  });

  it("merges dependencies from template and customSetup", async () => {
    const fs = await createSandpackFS({
      template: "react",
      customSetup: { dependencies: { foo: "*" } },
    });
    const pkg = JSON.parse(await fs.readFile("/package.json"));
    expect(pkg.dependencies.foo).toBe("*");
    expect(pkg.dependencies.react).toBeTruthy();
    fs.dispose();
  });

  it("creates an FS from customSetup without template", async () => {
    const fs = await createSandpackFS({
      files: { "/index.js": "console.log(1)" },
      customSetup: {
        entry: "/index.js",
        dependencies: { foo: "*" },
      },
    });
    const paths = await fs.list();
    expect(paths).toContain("/index.js");
    fs.dispose();
  });

  it("customSetup environment overrides template environment", async () => {
    const fs = await createSandpackFS({
      template: "react",
      customSetup: { environment: "parcel" },
    });
    expect(fs.getEnvironment()).toBe("parcel");
    fs.dispose();
  });

  it("throws when no template and no files", async () => {
    await expect(
      createSandpackFS({ customSetup: {} }),
    ).rejects.toThrow("[sandpack-react]: without a template, you must pass at least one file");
  });

  it("throws for an invalid template", async () => {
    await expect(
      // @ts-expect-error intentional invalid template
      createSandpackFS({ template: "WHATEVER" }),
    ).rejects.toThrow(`[sandpack-react]: invalid template "WHATEVER" provided`);
  });
});
