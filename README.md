<img style="width:100%" src="https://user-images.githubusercontent.com/4838076/163777661-a44ec0a9-ee7c-483a-bdbb-7898ba665f68.gif" alt="Component toolkit for live running code editing experiences" />

# Sandpack (immediately.run fork)

This is a **fork of [CodeSandbox Sandpack](https://github.com/codesandbox/sandpack)**,
adapted to power [immediately.run](https://immediately.run). It keeps Sandpack's
component surface and much of its code, but the runtime model has changed
significantly — it is **not** a drop-in replacement for upstream `@codesandbox/sandpack-*`.

Packages are published under the **`@immediately-run/`** scope
(`@immediately-run/sandpack-client`, `-react`, `-themes`).

## How this fork differs from upstream

- **Filesystem-backed, not a files map.** A ZenFS-backed `SandpackFS` is the
  source of truth. `SandpackProvider` takes a fully-initialized `fs`
  (`createSandpackFS(...)`) instead of a `files` module map, so edits, the running
  app, and the bundler all share one filesystem.
- **In-browser bundler that self-watches the filesystem.** Instead of sending a
  `compile` message with the full module map on every change, the host delivers
  bootstrap config **once** via a `register-frame` handshake (resolved
  `package.json` out-of-band, the dirty-path set, an optional batch-hydration
  snapshot, the chrome region) and then only relays changed paths. The default
  execution path no longer relies on CodeSandbox's remote infrastructure (the
  Nodebox remote-VM and static-HTML clients are non-default).
- **Host / capability integration.** Carries the hooks immediately.run needs —
  chrome region, host-pinned SDK integrity, copy-on-write overlay provenance —
  to run inside the platform's sandboxed-iframe capability model.
- **Trimmed where the platform doesn't use it.** e.g. removed whole-tree
  filesystem reads that backed unused editor features, and the
  "Open in CodeSandbox" export is gated off.

Upstream docs still describe the component APIs:
[sandpack.codesandbox.io](https://sandpack.codesandbox.io/). Where this fork has
diverged, the specs and notes in the `docs` repo and this repo
(`CODE_SPEC_REFERENCES.md`, `DEPRECATION_CANDIDATES.md`) are authoritative.

---

## Sandpack Client

A small foundation package that sits on top of the bundler. It is framework
agnostic and facilitates the handshake between your context and the bundler iframe.

## Sandpack React

React components that give you the power of editable sandboxes that run in the browser.

```jsx
import { SandpackProvider, SandpackPreview } from "@immediately-run/sandpack-react";
import { createSandpackFS } from "@immediately-run/sandpack-react";
```

## Sandpack Themes

A list of themes to customize your Sandpack components.

```jsx
import { githubLight } from "@immediately-run/sandpack-themes";
```
