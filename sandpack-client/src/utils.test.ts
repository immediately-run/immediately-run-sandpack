import { bindContext, InMemory, mount, resolveMountConfig } from "@zenfs/core";
import { addPackageJSONIfNeeded, normalizePath } from "./utils";

const baseFiles = {
  "/package.json": {
    code: `{
  "name": "custom-package",
  "main": "old-entry.js",
  "dependencies": { "baz": "*" },
  "devDependencies": { "baz": "*" }
}`,
  },
};

async function mkFs(files?: Record<string, { code: string }>) {
  const dir = `/${(Math.random() * 100000).toString(16)}`;
  const fs = await resolveMountConfig({ backend: InMemory, label: dir });
  mount(dir, fs);
  const context = bindContext({ root: dir }).fs;
  if (files) {
    for (const [path, { code }] of Object.entries(files)) {
      await context.promises.writeFile(path, code);
    }
  }
  return context;
}

describe(addPackageJSONIfNeeded, () => {
  afterEach(() => {
    // SandpackFS instances allocate unique mount points, so there's nothing
    // shared between tests to clean up aside from their own disposal (handled
    // implicitly once they go out of scope).
  });

  test("it merges the package.json - dependencies", async () => {
    const fs = await mkFs();
    await addPackageJSONIfNeeded(fs, { foo: "*" });
    const pkg = JSON.parse(
      await fs.promises.readFile("/package.json", "utf-8"),
    );
    expect(pkg.dependencies).toEqual({ baz: "*", foo: "*" });
  });

  test("it merges the package.json - dev-dependencies", async () => {
    const fs = await mkFs();
    await addPackageJSONIfNeeded(fs, undefined, { foo: "*" });
    const pkg = JSON.parse(
      await fs.promises.readFile("/package.json", "utf-8"),
    );
    expect(pkg.devDependencies).toEqual({ baz: "*", foo: "*" });
  });

  test("it merges the package.json - entry", async () => {
    const fs = await mkFs();
    await addPackageJSONIfNeeded(fs, undefined, undefined, "new-entry.js");
    const pkg = JSON.parse(
      await fs.promises.readFile("/package.json", "utf-8"),
    );
    expect(pkg.main).toEqual("new-entry.js");
  });

  test("it set the entry file into package.json", async () => {
    const fs = await mkFs({
      "/package.json": {
        code: `{
      "name": "custom-package",
      "dependencies": { "baz": "*" },
      "devDependencies": { "baz": "*" }
    }`,
      },
    });
    await addPackageJSONIfNeeded(fs, undefined, undefined, "new-entry.js");
    const pkg = JSON.parse(
      await fs.promises.readFile("/package.json", "utf-8"),
    );
    expect(pkg.main).toEqual("new-entry.js");
  });

  test("it returns an error when there is not dependencies at all", async () => {
    const fs = await mkFs({ "/package.json": { code: `{}` } });

    await expect(addPackageJSONIfNeeded(fs)).rejects.toThrow(
      '[sandpack-client]: "entry" was not specified',
    );
  });
});

describe(normalizePath, () => {
  it("adds trailing slash to a string", () => {
    expect(normalizePath("foo")).toBe("/foo");
    expect(normalizePath("/foo")).toBe("/foo");
  });

  it("adds trailing slash to an array of string", () => {
    expect(normalizePath(["foo", "/baz"])).toStrictEqual(["/foo", "/baz"]);
    expect(normalizePath(["/foo", "/baz"])).toStrictEqual(["/foo", "/baz"]);
  });

  it("adds trailing slash to an object", () => {
    expect(normalizePath({ foo: "", baz: "" })).toStrictEqual({
      "/baz": "",
      "/foo": "",
    });
    expect(normalizePath({ "/foo": "", "/baz": "" })).toStrictEqual({
      "/baz": "",
      "/foo": "",
    });
  });

  it("doesn't tranform invalid values", () => {
    expect(normalizePath(undefined)).toBe(null);
    expect(normalizePath(null)).toBe(null);
    expect(normalizePath(123)).toBe(null);
  });
});
