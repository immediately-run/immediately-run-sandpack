import * as fs from "fs";
import * as path from "path";

import { InitializationGuard } from "./initialization-guard";

/**
 * R3-353 — the re-register guard.
 *
 * The property under test is a NEGATIVE one ("a boot the host did not cause is
 * refused"), so most of this file is the sequences that must NOT be honoured.
 * The second describe block is the greppable half, in the style of
 * `no-raw-app-iframe.test.ts`: the guard is only worth anything if the client
 * actually arms it on navigation and consults it before registering, and that
 * wiring cannot be reached from a unit test (constructing a `SandpackRuntime`
 * needs a real `SandpackFS`, a Babel worker and a live iframe).
 */
describe("InitializationGuard (R3-353)", () => {
  it("honours the boot that follows a host navigation", () => {
    const guard = new InitializationGuard();
    guard.arm(); // the constructor's setLocationURLIntoIFrame
    expect(guard.consume()).toBe(true);
  });

  it("REFUSES a boot with nothing armed — the self-navigation case", () => {
    // The frame navigated itself; no client navigation preceded this boot.
    const guard = new InitializationGuard();
    expect(guard.consume()).toBe(false);
    expect(guard.isDetached).toBe(true);
  });

  it("REFUSES a SECOND boot after one legitimate navigation", () => {
    // The realistic shape of the attack: boot normally, register, then
    // `location.href = '…'` and post `initialized` again from whatever loads.
    const guard = new InitializationGuard();
    guard.arm();
    expect(guard.consume()).toBe(true);
    expect(guard.consume()).toBe(false);
  });

  it("stays refused forever once detached — a rogue document cannot re-arm it", () => {
    const guard = new InitializationGuard();
    expect(guard.consume()).toBe(false);
    // Everything a rogue frame could do afterwards, including racing a
    // legitimate host navigation.
    guard.arm();
    guard.arm();
    expect(guard.consume()).toBe(false);
    expect(guard.consume()).toBe(false);
    expect(guard.isDetached).toBe(true);
    expect(guard.pending).toBe(0);
  });

  it("counts rather than latches, so navigate–navigate–boot–boot is legitimate", () => {
    // Two host navigations can be in flight (a constructor navigation
    // immediately followed by a `refresh` dispatch). A boolean latch would eat
    // its own credit here and tear down a perfectly good frame.
    const guard = new InitializationGuard();
    guard.arm();
    guard.arm();
    expect(guard.consume()).toBe(true);
    expect(guard.consume()).toBe(true);
    expect(guard.consume()).toBe(false); // …but not a third
  });

  it("honours interleaved navigate/boot pairs indefinitely (refresh loops)", () => {
    const guard = new InitializationGuard();
    for (let i = 0; i < 10; i++) {
      guard.arm();
      expect(guard.consume()).toBe(true);
    }
    expect(guard.isDetached).toBe(false);
  });

  it("starts closed — a boot before any navigation is refused", () => {
    // Defensive: the field initialiser must not start at 1 "because the
    // constructor navigates anyway". The constructor arms it by CALLING
    // setLocationURLIntoIFrame, which is what keeps arm and navigate together.
    expect(new InitializationGuard().pending).toBe(0);
  });
});

describe("the guard is actually wired into the runtime client (greppable check)", () => {
  const source = fs.readFileSync(path.join(__dirname, "index.ts"), "utf-8");
  const uncommented = source
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      return !(t.startsWith("*") || t.startsWith("//") || t.startsWith("/*"));
    })
    .join("\n");

  it("arms the guard inside setLocationURLIntoIFrame — the ONE navigation site", () => {
    // If a future client navigates the frame some other way, that path must arm
    // the guard too or it will tear down its own frame on the next boot. Pinning
    // the arm to this method is what makes "every legitimate boot was preceded by
    // an arm" checkable at all.
    const body =
      /setLocationURLIntoIFrame\(\)\s*:\s*void\s*\{([\s\S]*?)\n  \}/.exec(
        uncommented,
      );
    expect(body).not.toBeNull();
    expect(body![1]).toMatch(/initGuard\.arm\(\)/);
    // …and it arms BEFORE the navigation, so a synchronous boot cannot beat it.
    expect(body![1].indexOf("initGuard.arm()")).toBeLessThan(
      body![1].indexOf("location.replace"),
    );
  });

  it("consults the guard before connecting the fs on `initialized`", () => {
    // The order is the security property: the check must precede
    // `fs.connectRemote()`, because minting a port for a rogue document and then
    // deciding not to register it has already handed over the filesystem.
    const handler = uncommented.slice(
      uncommented.indexOf('mes.type !== "initialized"'),
    );
    const check = handler.indexOf("consumeExpectedInitialization()");
    const connect = handler.indexOf("this.fs.connectRemote()");
    expect(check).toBeGreaterThan(-1);
    expect(connect).toBeGreaterThan(-1);
    expect(check).toBeLessThan(connect);
  });

  it("tears the frame down on refusal rather than merely ignoring the message", () => {
    // Ignoring would leave the rogue document running, with everything it
    // scraped before it navigated, inside our iframe.
    const refusal =
      /consumeExpectedInitialization\(\)\s*:\s*boolean\s*\{([\s\S]*?)\n  \}/.exec(
        uncommented,
      );
    expect(refusal).not.toBeNull();
    expect(refusal![1]).toMatch(/about:blank/);
    expect(refusal![1]).toMatch(/this\.destroy\(\)/);
  });
});
