/**
 * Parent-side fetch + cache for immutable, exact-versioned module URLs.
 *
 * The bundler iframe runs at an opaque origin (sandboxed without
 * `allow-same-origin`), so it has no persistent storage of any kind — its own
 * Cache API is unavailable. It therefore forwards immutable-URL fetches here
 * over the iframe protocol (`protocol-immutable-fetch`), and the parent — a
 * real origin — serves them cache-first from a persistent Cache API cache.
 *
 * Security: the handler only fetches URLs matching {@link IMMUTABLE_URL_ALLOWLIST}.
 * The iframe runs untrusted code, and an unrestricted parent-side fetch proxy
 * would let it read arbitrary cross-origin responses with the parent's network
 * context (a CORS bypass). The allowlist mirrors the prefixes the bundler
 * registers via `registerImmutableUrlPrefix` (see sandpack-bundler
 * `src/utils/fetch.ts`) — keep the two in sync.
 */

/**
 * URL prefixes whose responses never change for a given URL (the URL encodes
 * the exact content version). Only these may be fetched on the iframe's
 * behalf, and they are safe to cache forever.
 */
const IMMUTABLE_URL_ALLOWLIST = [
  // Module CDN, exact-versioned package bundles. (NOT /dep_tree/, which
  // resolves semver ranges and changes as new versions publish.)
  "https://sandpack-cdn-staging.blazingly.io/package/",
  // unpkg files, requested by the bundler at registry-resolved exact versions.
  "https://unpkg.com/",
];

const IMMUTABLE_CACHE_NAME = "sandpack-immutable-fetch-v1";

export interface ImmutableFetchResult {
  status: number;
  contentType: string;
  /** Structured-cloned (copied) to the iframe in the protocol response. */
  body: ArrayBuffer;
}

const serializeResponse = async (
  res: Response,
): Promise<ImmutableFetchResult> => ({
  status: res.status,
  contentType: res.headers.get("content-type") ?? "",
  body: await res.arrayBuffer(),
});

// CacheStorage may be unavailable (insecure context) or fail (storage
// pressure); degrade to a plain fetch rather than failing the request.
const openCache = async (): Promise<Cache | undefined> => {
  try {
    return await caches.open(IMMUTABLE_CACHE_NAME);
  } catch {
    return undefined;
  }
};

/**
 * `protocol-immutable-fetch` handler: serve an allowlisted immutable URL,
 * cache-first from the persistent parent-side cache.
 */
export async function handleImmutableFetch(
  url: unknown,
): Promise<ImmutableFetchResult> {
  if (
    typeof url !== "string" ||
    !IMMUTABLE_URL_ALLOWLIST.some((prefix) => url.startsWith(prefix))
  ) {
    throw new Error(`URL not allowed for immutable fetch: ${String(url)}`);
  }

  const cache = await openCache();
  if (cache) {
    const hit = await cache.match(url).catch(() => undefined);
    if (hit) {
      return serializeResponse(hit);
    }
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Immutable fetch failed with status ${res.status}: ${url}`);
  }
  if (cache) {
    // Clone before the body is consumed; a failed put (quota) only costs the
    // cache entry, not the request.
    await cache.put(url, res.clone()).catch(() => {});
  }
  return serializeResponse(res);
}
