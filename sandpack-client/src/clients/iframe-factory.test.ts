import {
  createSandboxedIframe,
  ensureSandboxed,
  assertOpaqueOrigin,
} from "./iframe-factory";

// Minimal fake element/doc so the test doesn't depend on a DOM environment.
function fakeIframe(initialSandbox?: string) {
  const attrs: Record<string, string> = {};
  if (initialSandbox !== undefined) attrs.sandbox = initialSandbox;
  return {
    _attrs: attrs,
    getAttribute: (k: string) => (k in attrs ? attrs[k] : null),
    setAttribute: (k: string, v: string) => {
      attrs[k] = v;
    },
  } as unknown as HTMLIFrameElement & { _attrs: Record<string, string> };
}
const fakeDoc = { createElement: () => fakeIframe() } as unknown as Document;
const attrsOf = (f: HTMLIFrameElement) =>
  (f as unknown as { _attrs: Record<string, string> })._attrs;

describe("iframe factory — the opaque-origin invariant (G1/T1)", () => {
  it("createSandboxedIframe sets allow-scripts and NOT allow-same-origin", () => {
    const f = createSandboxedIframe(fakeDoc);
    expect(attrsOf(f).sandbox).toContain("allow-scripts");
    expect(attrsOf(f).sandbox).not.toContain("allow-same-origin");
  });

  it("assertOpaqueOrigin THROWS when allow-same-origin is present", () => {
    expect(() =>
      assertOpaqueOrigin(fakeIframe("allow-scripts allow-same-origin")),
    ).toThrow(/allow-same-origin/);
  });

  it("assertOpaqueOrigin passes for an opaque-origin sandbox", () => {
    expect(() =>
      assertOpaqueOrigin(fakeIframe("allow-scripts allow-popups")),
    ).not.toThrow();
  });

  it("ensureSandboxed hardens a bare host-provided iframe", () => {
    const f = fakeIframe();
    ensureSandboxed(f);
    expect(attrsOf(f).sandbox).toContain("allow-scripts");
    expect(attrsOf(f).sandbox).not.toContain("allow-same-origin");
  });

  it("ensureSandboxed REFUSES a passed iframe that already has allow-same-origin", () => {
    expect(() =>
      ensureSandboxed(fakeIframe("allow-scripts allow-same-origin")),
    ).toThrow(/allow-same-origin/);
  });
});
