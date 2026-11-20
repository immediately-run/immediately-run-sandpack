/**
 * The Babel worker lease: one worker per frame by default, one worker for the whole
 * page with `shared`.
 */
import {
  SHARED_WORKER_IDLE_MS,
  __resetSharedBabelWorkersForTests,
  leaseBabelWorker,
} from "./babel-worker";

const URL_A = "/babel-worker/babel-worker.js";
const URL_B = "/babel-worker/other.js";

class FakeWorker {
  static spawned: FakeWorker[] = [];
  terminated = false;
  /** Every `connect` this worker was sent, with the port that came with it. */
  connects: unknown[] = [];
  private errorListeners: Array<() => void> = [];
  constructor(public url: string) {
    FakeWorker.spawned.push(this);
  }
  postMessage(message: { type: string }, transfer: unknown[]) {
    if (message.type === "connect") this.connects.push(transfer[0]);
  }
  addEventListener(type: string, listener: () => void) {
    if (type === "error") this.errorListeners.push(listener);
  }
  terminate() {
    this.terminated = true;
  }
  failToLoad() {
    for (const listener of this.errorListeners) listener();
  }
}

class FakeMessageChannel {
  port1 = { end: 1, channel: this };
  port2 = { end: 2, channel: this };
}

const globals = globalThis as Record<string, unknown>;
const original = {
  Worker: globals.Worker,
  MessageChannel: globals.MessageChannel,
};

beforeEach(() => {
  jest.useFakeTimers();
  FakeWorker.spawned = [];
  globals.Worker = FakeWorker;
  globals.MessageChannel = FakeMessageChannel;
});

afterEach(() => {
  __resetSharedBabelWorkersForTests();
  jest.useRealTimers();
  globals.Worker = original.Worker;
  globals.MessageChannel = original.MessageChannel;
});

describe("a dedicated lease (the default)", () => {
  it("spawns one worker per lease and terminates it on release", () => {
    const first = leaseBabelWorker(URL_A);
    const second = leaseBabelWorker(URL_A);

    expect(FakeWorker.spawned).toHaveLength(2);
    first.release();
    expect(FakeWorker.spawned[0].terminated).toBe(true);
    expect(FakeWorker.spawned[1].terminated).toBe(false);
    second.release();
    expect(FakeWorker.spawned[1].terminated).toBe(true);
  });

  it("gives the iframe the far end of the channel whose near end the worker got", () => {
    const lease = leaseBabelWorker(URL_A);
    const [workerPort] = FakeWorker.spawned[0].connects as Array<{
      end: number;
      channel: unknown;
    }>;
    const iframePort = lease.port as unknown as {
      end: number;
      channel: unknown;
    };

    expect(workerPort.end).toBe(1);
    expect(iframePort.end).toBe(2);
    expect(iframePort.channel).toBe(workerPort.channel);
  });
});

describe("a shared lease", () => {
  it("serves every frame on the page from ONE worker, each over its own channel", () => {
    const leases = [1, 2, 3].map(() =>
      leaseBabelWorker(URL_A, { shared: true }),
    );

    expect(FakeWorker.spawned).toHaveLength(1);
    expect(FakeWorker.spawned[0].connects).toHaveLength(3);
    expect(new Set(leases.map((lease) => lease.port)).size).toBe(3);
  });

  it("keeps the worker while any frame still holds it", () => {
    const first = leaseBabelWorker(URL_A, { shared: true });
    const second = leaseBabelWorker(URL_A, { shared: true });

    first.release();
    jest.advanceTimersByTime(SHARED_WORKER_IDLE_MS * 10);

    expect(FakeWorker.spawned[0].terminated).toBe(false);
    second.release();
  });

  it("terminates the worker once nothing has held it for the idle period", () => {
    const lease = leaseBabelWorker(URL_A, { shared: true });
    lease.release();

    jest.advanceTimersByTime(SHARED_WORKER_IDLE_MS - 1);
    expect(FakeWorker.spawned[0].terminated).toBe(false);
    jest.advanceTimersByTime(1);
    expect(FakeWorker.spawned[0].terminated).toBe(true);

    // The next frame gets a fresh worker, not a port to the terminated one.
    leaseBabelWorker(URL_A, { shared: true });
    expect(FakeWorker.spawned).toHaveLength(2);
  });

  it("a reload (release, then lease again) keeps the warm worker", () => {
    const before = leaseBabelWorker(URL_A, { shared: true });
    before.release();
    jest.advanceTimersByTime(SHARED_WORKER_IDLE_MS / 2);

    const after = leaseBabelWorker(URL_A, { shared: true });
    jest.advanceTimersByTime(SHARED_WORKER_IDLE_MS * 10);

    expect(FakeWorker.spawned).toHaveLength(1);
    expect(FakeWorker.spawned[0].terminated).toBe(false);
    after.release();
  });

  it("releasing twice gives up one hold, not two", () => {
    const first = leaseBabelWorker(URL_A, { shared: true });
    const second = leaseBabelWorker(URL_A, { shared: true });

    first.release();
    first.release();
    jest.advanceTimersByTime(SHARED_WORKER_IDLE_MS * 10);

    // `second` still holds it: a double release must not have counted against it.
    expect(FakeWorker.spawned[0].terminated).toBe(false);
    second.release();
  });

  it("does not share across different worker scripts", () => {
    leaseBabelWorker(URL_A, { shared: true });
    leaseBabelWorker(URL_B, { shared: true });

    expect(FakeWorker.spawned.map((worker) => worker.url)).toEqual([
      URL_A,
      URL_B,
    ]);
  });

  it("replaces a worker whose script failed to load", () => {
    leaseBabelWorker(URL_A, { shared: true });
    FakeWorker.spawned[0].failToLoad();

    leaseBabelWorker(URL_A, { shared: true });

    expect(FakeWorker.spawned).toHaveLength(2);
    expect(FakeWorker.spawned[1].connects).toHaveLength(1);
  });

  it("is independent of dedicated leases on the same page", () => {
    const shared = leaseBabelWorker(URL_A, { shared: true });
    const dedicated = leaseBabelWorker(URL_A);

    expect(FakeWorker.spawned).toHaveLength(2);
    dedicated.release();
    expect(FakeWorker.spawned[0].terminated).toBe(false);
    shared.release();
  });
});
