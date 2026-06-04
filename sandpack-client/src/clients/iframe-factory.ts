/**
 * The single chokepoint for creating **app iframes** (UI_AS_APPS_SPEC §2 / G1 /
 * threat T1).
 *
 * App iframes MUST be opaque-origin: `sandbox="allow-scripts …"` WITHOUT
 * `allow-same-origin`. With `allow-same-origin` alongside `allow-scripts` an app
 * could remove its own sandboxing and reach the parent — the whole capability
 * model collapses. This is the one invariant with no defense-in-depth, so
 * creation is centralized here and the resolved attribute is asserted. Raw
 * `document.createElement('iframe')` for app content elsewhere is forbidden (a
 * greppable CI check), so the verifiable invariant is "every app iframe is born
 * in this factory."
 *
 * Scope: the opaque-origin app iframes (the runtime + static preview clients).
 * The node/nodebox emulator is a different execution model and is intentionally
 * NOT routed through here.
 */

const APP_SANDBOX =
  "allow-forms allow-modals allow-popups allow-presentation allow-scripts allow-downloads allow-pointer-lock";

const APP_ALLOW =
  "accelerometer; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; clipboard-read; clipboard-write; xr-spatial-tracking;";

/** Throw if the iframe would run scripts at a same-origin context (G1/T1). */
export function assertOpaqueOrigin(iframe: HTMLIFrameElement): void {
  const sandbox = iframe.getAttribute("sandbox") ?? "";
  if (/(^|\s)allow-same-origin(\s|$)/.test(sandbox)) {
    throw new Error(
      "Refusing an app iframe with allow-same-origin alongside allow-scripts: " +
        "the sandbox would be void (UI_AS_APPS_SPEC G1/T1).",
    );
  }
}

/** Create an opaque-origin sandboxed iframe for running untrusted app code. */
export function createSandboxedIframe(
  doc: Document = document,
): HTMLIFrameElement {
  const iframe = doc.createElement("iframe");
  iframe.setAttribute("sandbox", APP_SANDBOX);
  iframe.setAttribute("allow", APP_ALLOW);
  assertOpaqueOrigin(iframe);
  return iframe;
}

/**
 * Ensure a (possibly externally-provided) app iframe is opaque-origin: set the
 * sandbox/allow attributes if absent, then assert no `allow-same-origin`. Use
 * this for the case where a host passes in its own iframe element.
 */
export function ensureSandboxed(iframe: HTMLIFrameElement): void {
  if (!iframe.getAttribute("sandbox")) {
    iframe.setAttribute("sandbox", APP_SANDBOX);
    iframe.setAttribute("allow", APP_ALLOW);
  }
  assertOpaqueOrigin(iframe);
}
