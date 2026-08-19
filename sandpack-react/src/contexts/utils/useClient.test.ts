/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";

import { createTestFilesState } from "./testHelpers";
import { useClient } from "./useClient";
import type { UseClientOperations } from "./useClient";
import type { FilesState } from "./useFiles";

let filesState: FilesState & { visibleFilesFromProps: string[] };

beforeEach(async () => {
  filesState = await createTestFilesState();
});

afterEach(() => {
  filesState.fs.dispose();
});

/** How many *caller-registered* unsubscribe functions the provider is holding
 *  for a client — i.e. excluding `__sp_timeout_reconcile__`, the internal
 *  per-client listener that clears the bundler timeout on this client's own
 *  "done"/"connected" (the #4 panel race fix). */
const countUserUnsubscribes = (
  instance: UseClientOperations,
  name = "client-id",
): number =>
  Object.keys(
    instance.unsubscribeClientListenersRef.current[name] ?? {},
  ).filter((key) => key !== "__sp_timeout_reconcile__").length;

const getAmountOfListener = (
  instance: UseClientOperations,
  name = "client-id",
  ignoreGlobalListener = false,
): number => {
  return (
    Object.keys(instance.clients[name].iframeProtocol.channelListeners).length -
    1 - // less protocol listener
    1 - // less the per-client `__sp_timeout_reconcile__` listener
    (ignoreGlobalListener ? 0 : 1) // less the global Sandpack-react listener
  );
};

describe(useClient, () => {
  describe("listeners", () => {
    it("sets a listener, but the client hasn't been created yet - no global listener", async () => {
      const { result } = renderHook(() => useClient({}, filesState));

      const operations = result.current[1];

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        operations.addListener(mock, "client-id");
      });

      // Act: Create client
      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-id",
        );

        await operations.runSandpack();
      });

      // Expect: one pending unsubscribe function
      expect(countUserUnsubscribes(operations, "client-id")).toBe(1);

      // Expect: no global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length,
      ).toBe(0);

      // Expect: one client
      expect(Object.keys(operations.clients)).toEqual(["client-id"]);
    });

    it("sets a listener, but the client hasn't been created yet - global listener", async () => {
      const { result } = renderHook(() => useClient({}, filesState));

      const operations = result.current[1];

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        operations.addListener(mock /* , no client-id */);
      });

      // Act: Create client
      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-id",
        );
        await operations.runSandpack();
      });

      // Expect: one pending unsubscribe function
      expect(countUserUnsubscribes(operations, "client-id")).toBe(1);

      // Expect: no global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length,
      ).toBe(1);

      // Expect: one listener in the client
      expect(getAmountOfListener(operations)).toBe(1);
    });

    it("set a listener, but the client has already been created - no global listener", async () => {
      const { result } = renderHook(() => useClient({}, filesState));
      const operations = result.current[1];

      // Act: Create client
      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-id",
        );
        await operations.runSandpack();
      });

      // Expect: no pending unsubscribe function
      expect(countUserUnsubscribes(operations, "client-id")).toBe(0);

      // Expect: no global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length,
      ).toBe(0);

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        operations.addListener(mock, "client-id");
      });

      // Expect: no pending unsubscribe function
      expect(countUserUnsubscribes(operations, "client-id")).toBe(0);

      // Expect: no global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length,
      ).toBe(0);

      // Expect: one listener in the client
      expect(getAmountOfListener(operations)).toBe(1);
    });

    it("set a listener, but the client has already been created - global listener", async () => {
      const { result } = renderHook(() => useClient({}, filesState));
      const operations = result.current[1];

      // Act: Create client
      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-id",
        );

        await operations.runSandpack();
      });

      // Expect: no pending unsubscribe function
      expect(countUserUnsubscribes(operations, "client-id")).toBe(0);

      // Expect: no global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length,
      ).toBe(0);

      // Act: Add listener
      const mock = jest.fn();
      act(() => {
        operations.addListener(mock /* , no client-id */);
      });

      // Expect: no pending unsubscribe function, because it's a global
      expect(countUserUnsubscribes(operations, "client-id")).toBe(0);

      // Expect: one global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length,
      ).toBe(1);

      // Expect: one listener in the client
      expect(getAmountOfListener(operations)).toBe(1);
    });

    it("sets a new listener, and then create one more client", async () => {
      const { result } = renderHook(() => useClient({}, filesState));
      const operations = result.current[1];

      // Act: Add listener
      act(() => {
        const mock = jest.fn();
        operations.addListener(mock, "client-id");
      });

      // Act: Create client
      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-id",
        );
        await operations.runSandpack();
      });

      // Expect: one pending unsubscribe function
      expect(countUserUnsubscribes(operations, "client-id")).toBe(1);

      // Expect: no global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length,
      ).toBe(0);

      // Expect: one listener in the client
      expect(getAmountOfListener(operations)).toBe(1);

      // Act: Add one more listener
      act(() => {
        const anotherMock = jest.fn();
        operations.addListener(anotherMock /* , no client-id */);
      });

      // Expect: one global listener
      expect(
        Object.keys(operations.queuedListenersRef.current.global).length,
      ).toBe(1);

      // Expect: two listener in the client
      expect(getAmountOfListener(operations)).toBe(2);
    });

    it("unsubscribes only from the assigned client id", async () => {
      const { result } = renderHook(() => useClient({}, filesState));
      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-1",
        );
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-2",
        );

        await operations.runSandpack();
      });

      // Initial state
      expect(getAmountOfListener(operations, "client-1")).toBe(0);
      expect(getAmountOfListener(operations, "client-2", true)).toBe(0);

      // Add listeners
      act(() => {
        operations.addListener(jest.fn(), "client-1");
      });

      // Add listener only to the client-1
      expect(getAmountOfListener(operations, "client-1")).toBe(1);
      expect(getAmountOfListener(operations, "client-2", true)).toBe(0);

      act(() => {
        operations.addListener(jest.fn(), "client-2");
      });

      // Then add a new listener to client-2
      expect(getAmountOfListener(operations, "client-1")).toBe(1);
      expect(getAmountOfListener(operations, "client-2", true)).toBe(1);
    });

    it("doesn't trigger global unsubscribe", async () => {
      const { result } = renderHook(() => useClient({}, filesState));
      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-1",
        );
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-2",
        );

        await operations.runSandpack();
      });

      act(() => {
        operations.addListener(jest.fn());
        operations.addListener(jest.fn());
      });
      const unsubscribe = operations.addListener(jest.fn());

      expect(getAmountOfListener(operations, "client-1")).toBe(3);
      expect(getAmountOfListener(operations, "client-2", true)).toBe(3);

      unsubscribe();

      expect(getAmountOfListener(operations, "client-1")).toBe(2);
      expect(getAmountOfListener(operations, "client-2", true)).toBe(2);
    });

    it("unsubscribe all the listeners from a specific client when it unmonts", async () => {
      const { result } = renderHook(() => useClient({}, filesState));
      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-1",
        );
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-2",
        );

        operations.addListener(jest.fn());
        operations.addListener(jest.fn());
        operations.addListener(jest.fn());

        await operations.runSandpack();
      });

      expect(getAmountOfListener(operations, "client-1")).toBe(3);
      expect(getAmountOfListener(operations, "client-2", true)).toBe(3);

      act(() => {
        operations.unregisterBundler("client-2");
      });

      expect(getAmountOfListener(operations, "client-1")).toBe(3);
      expect(operations.clients["client-2"]).toBe(undefined);
    });

    // R3-240: `createClient` is async, so two overlapping calls for ONE clientId
    // (React 18 StrictMode's double-invoked effects make this deterministic in
    // dev) both pass the entry "destroy the existing client" guard while
    // `clients[clientId]` is still empty. The loser used to keep the provider's
    // single global `handleMessage` subscription while the winner took the
    // clients map — leaving the provider deaf to the LIVE client, so
    // `connectedRef` never flipped and every `dispatch()` sat in the pre-connect
    // queue forever (host→iframe messages never arrived for chrome regions).
    it("moves the global listener to the surviving client when one clientId is created twice concurrently", async () => {
      const { result } = renderHook(() => useClient({}, filesState));
      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-id",
        );

        // Overlapping creations for the same clientId.
        await Promise.all([operations.runSandpack(), operations.runSandpack()]);
      });

      // Expect: still exactly one client under that id...
      expect(Object.keys(operations.clients)).toEqual(["client-id"]);

      // ...and it carries the global listener (the helper subtracts the protocol
      // listener AND the global one, so a client missing the global listener
      // yields -1 here).
      expect(getAmountOfListener(operations, "client-id")).toBe(0);
    });
  });

  // R3-290. The queue itself is covered in `preConnectDispatchQueue.test.ts`, and
  // it was always correct. What had no test was the SEAM — the gate that decides
  // when to flush it — and that is where the defect lived: gating only on `done`
  // deadlocks every host announcement the first compile itself depends on.
  describe("pre-connect flush gate", () => {
    const emit = (
      operations: UseClientOperations,
      msg: unknown,
      name = "client-id",
    ): void => {
      Object.values(
        operations.clients[name].iframeProtocol.channelListeners as Record<
          string,
          (m: unknown) => void
        >,
      ).forEach((listener) => listener(msg));
    };

    const bootClient = async (
      operations: UseClientOperations,
    ): Promise<void> => {
      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-id",
        );
        await operations.runSandpack();
      });
    };

    it("flushes on `start`, so a mount the first compile WAITS FOR can arrive", async () => {
      const { result } = renderHook(() => useClient({}, filesState));
      const operations = result.current[1];
      await bootClient(operations);

      const dispatchSpy = jest.spyOn(operations.clients["client-id"], "dispatch");

      // The host announces a declared git-library mount eagerly, before any
      // compile has finished. Buffering it here is correct...
      act(() => {
        operations.dispatchMessage({
          type: "mount-add",
          mount: { path: "/mnt/abc", moduleName: "@scope/lib" },
        } as never);
      });
      expect(dispatchSpy).not.toHaveBeenCalled();

      // ...but it must be released when the bundler STARTS compiling, because the
      // compile is about to block waiting for this very mount. Waiting for `done`
      // is waiting for the thing that cannot happen until the mount arrives.
      act(() => emit(operations, { type: "start", firstLoad: true }));

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy.mock.calls[0][0]).toMatchObject({ type: "mount-add" });
    });

    it("still flushes on `done` when no `start` was seen", async () => {
      const { result } = renderHook(() => useClient({}, filesState));
      const operations = result.current[1];
      await bootClient(operations);

      const dispatchSpy = jest.spyOn(operations.clients["client-id"], "dispatch");

      act(() => {
        operations.dispatchMessage({ type: "fs-change", paths: ["/a"] } as never);
      });
      expect(dispatchSpy).not.toHaveBeenCalled();

      act(() => emit(operations, { type: "done", compilatonError: false }));

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });

    it("does not flush on a compilation-error `done`, and never replays twice", async () => {
      const { result } = renderHook(() => useClient({}, filesState));
      const operations = result.current[1];
      await bootClient(operations);

      const dispatchSpy = jest.spyOn(operations.clients["client-id"], "dispatch");

      act(() => {
        operations.dispatchMessage({ type: "fs-change", paths: ["/a"] } as never);
      });

      act(() => emit(operations, { type: "done", compilatonError: true }));
      expect(dispatchSpy).not.toHaveBeenCalled();

      // Now a real start releases it — exactly once, even across later signals.
      act(() => emit(operations, { type: "start", firstLoad: true }));
      act(() => emit(operations, { type: "done", compilatonError: false }));
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("status", () => {
    it("returns the initial state", () => {
      const { result } = renderHook(() => useClient({}, filesState));
      const state = result.current[0];

      expect(state.status).toBe("initial");
    });

    it("returns the initial state, after register a bundler", async () => {
      const { result } = renderHook(() => useClient({}, filesState));

      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-1",
        );
      });

      expect(result.current[0].status).toBe("initial");
    });

    it("returns the running state, after init client", async () => {
      const { result } = renderHook(() => useClient({}, filesState));
      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-1",
        );

        await operations.runSandpack();
      });

      expect(result.current[0].status).toBe("running");
    });

    it("returns the idle state, after unmounting client", async () => {
      const { result } = renderHook(() => useClient({}, filesState));
      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-1",
        );

        await operations.runSandpack();
      });

      expect(result.current[0].status).toBe("running");

      act(() => {
        operations.unregisterBundler("client-1");
      });

      expect(result.current[0].status).toBe("idle");
    });

    it("keeps running if it unmounts a client and there's still another one running", async () => {
      const { result } = renderHook(() => useClient({}, filesState));
      const operations = result.current[1];

      await act(async () => {
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-1",
        );
        await operations.registerBundler(
          document.createElement("iframe"),
          "client-2",
        );

        await operations.runSandpack();
      });

      act(() => {
        operations.unregisterBundler("client-1");
      });

      expect(result.current[0].status).toBe("running");
    });

    it("starts a bundler registered while the autorun provider is idle (all prior clients unregistered)", async () => {
      // The mobile-carousel blank-preview bug: the provider's ONLY preview
      // unmounts (status recomputes to "idle"), then a preview mounts again in
      // a LATER commit. Nothing calls runSandpack() again, so without the
      // idle-register start the new iframe never gets a client and stays a
      // src-less blank forever.
      const { result } = renderHook(() => useClient({}, filesState));

      await act(async () => {
        await result.current[1].registerBundler(
          document.createElement("iframe"),
          "preview-1",
        );
        await result.current[1].runSandpack();
      });
      expect(Object.keys(result.current[1].clients)).toEqual(["preview-1"]);

      act(() => {
        result.current[1].unregisterBundler("preview-1");
      });
      expect(result.current[0].status).toBe("idle");
      expect(Object.keys(result.current[1].clients)).toEqual([]);

      // Registered AFTER the provider went idle — must boot on its own and
      // put the provider back into "running" (file-watching keys off it).
      await act(async () => {
        await result.current[1].registerBundler(
          document.createElement("iframe"),
          "preview-2",
        );
      });
      expect(Object.keys(result.current[1].clients)).toEqual(["preview-2"]);
      expect(result.current[0].status).toBe("running");
    });

    it("does not auto-start a bundler registered while an autorun=false provider is idle", async () => {
      // autorun=false starts "idle" by definition — a register must keep
      // waiting for the caller's explicit runSandpack().
      const { result } = renderHook(() =>
        useClient({ options: { autorun: false } }, filesState),
      );

      await act(async () => {
        await result.current[1].registerBundler(
          document.createElement("iframe"),
          "preview-1",
        );
      });

      expect(Object.keys(result.current[1].clients)).toEqual([]);
      expect(result.current[0].status).toBe("idle");
    });
  });
});
