/**
 * Who owns the parent-side Babel transpiler worker, and for how long.
 *
 * The sandboxed iframe cannot run its own worker — without `allow-same-origin` it has
 * an opaque origin, and a same-origin worker script will not load there — so the
 * parent spawns the worker on its real origin and hands the iframe one end of a
 * `MessageChannel`. Per-transform traffic then flows iframe<->worker directly over
 * the entangled ports; the parent does not relay it.
 *
 * ONE WORKER PER FRAME WAS THE COST. Each client used to spawn its own worker the
 * moment it started, and a page with three frames (edit mode: the app, the file
 * explorer, the editor) ran three — each fetching the ~5.5 MB worker bundle and
 * growing its own Babel heap, about 150 MB apiece during a load. Nothing in the worker
 * is per-frame, so with `shared` every client on the page leases the SAME worker and
 * only gets its own channel to it.
 *
 * `shared` is OPT-IN because it needs a worker that answers more than one `connect`.
 * The handshake was one-shot before `@immediately-run/transpiler` 0.11.0: an older
 * worker binds the first port and ignores the rest, so a second frame's transforms
 * would go unanswered until they timed out. A host turns sharing on in the same
 * change that pins a worker which supports it.
 */

/** A client's hold on a Babel worker: the port to transfer into its iframe, and the
 *  call that gives the worker up. */
export interface BabelWorkerLease {
  port: MessagePort;
  /** Idempotent. A dedicated worker is terminated; a shared one is terminated once
   *  no client has held it for {@link SHARED_WORKER_IDLE_MS}. */
  release(): void;
}

/**
 * How long a shared worker outlives its last lease. A frame that reloads, or a route
 * change that tears one frame down and mounts another, releases and re-leases within
 * moments; terminating in between would refetch and re-parse the bundle and throw away
 * a warm Babel. Long enough to bridge that, short enough that a page with no frames
 * left does not keep a worker for nothing.
 */
export const SHARED_WORKER_IDLE_MS = 30_000;

interface SharedWorker {
  worker: Worker;
  leases: number;
  idleTimer: ReturnType<typeof setTimeout> | null;
}

/** The page's shared workers, by script URL. One entry in practice: every frame is
 *  given the same `babelWorkerURL`. */
const sharedWorkers = new Map<string, SharedWorker>();

/** Hand `worker` one end of a fresh channel and return the other. The worker binds
 *  its message bus to the port on receipt. */
function connect(worker: Worker): MessagePort {
  const channel = new MessageChannel();
  worker.postMessage({ type: "connect" }, [channel.port1]);
  return channel.port2;
}

// Classic (not module) worker: the worker artifact is built as a classic script
// (`@immediately-run/transpiler`'s `build-worker.mjs`, `format: "iife"`), and a
// `{ type: "module" }` worker would refuse it.
const spawn = (workerURL: string): Worker => new Worker(workerURL);

function leaseDedicated(workerURL: string): BabelWorkerLease {
  const worker = spawn(workerURL);
  let released = false;
  return {
    port: connect(worker),
    release() {
      if (released) return;
      released = true;
      worker.terminate();
    },
  };
}

function leaseShared(workerURL: string): BabelWorkerLease {
  let entry = sharedWorkers.get(workerURL);
  if (!entry) {
    const created: SharedWorker = {
      worker: spawn(workerURL),
      leases: 0,
      idleTimer: null,
    };
    // A worker whose script failed to load never answers anything. Forget it, so the
    // next lease spawns a fresh one instead of connecting to a dead worker for the
    // life of the page. (Frames already holding it keep their ports; their transforms
    // fail as they would have with a dedicated worker.)
    created.worker.addEventListener("error", () => {
      if (sharedWorkers.get(workerURL) === created) {
        sharedWorkers.delete(workerURL);
      }
    });
    sharedWorkers.set(workerURL, created);
    entry = created;
  }
  const held = entry;
  if (held.idleTimer !== null) {
    clearTimeout(held.idleTimer);
    held.idleTimer = null;
  }
  held.leases++;

  let released = false;
  return {
    port: connect(held.worker),
    release() {
      if (released) return;
      released = true;
      held.leases--;
      if (held.leases > 0) return;
      held.idleTimer = setTimeout(() => {
        held.idleTimer = null;
        held.worker.terminate();
        if (sharedWorkers.get(workerURL) === held) {
          sharedWorkers.delete(workerURL);
        }
      }, SHARED_WORKER_IDLE_MS);
    },
  };
}

/**
 * Lease a Babel worker for one client. With `shared`, every lease on the page for the
 * same `workerURL` is served by one worker; without it, each lease spawns its own
 * (the behaviour before sharing existed).
 */
export function leaseBabelWorker(
  workerURL: string,
  options: { shared?: boolean } = {},
): BabelWorkerLease {
  return options.shared ? leaseShared(workerURL) : leaseDedicated(workerURL);
}

/** Test seam: terminate and forget every shared worker. */
export function __resetSharedBabelWorkersForTests(): void {
  for (const entry of sharedWorkers.values()) {
    if (entry.idleTimer !== null) clearTimeout(entry.idleTimer);
    entry.worker.terminate();
  }
  sharedWorkers.clear();
}
