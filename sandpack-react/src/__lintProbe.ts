// R3-664 CI fault injection (reverted within this PR): a real exhaustive-deps
// warning — the effect uses `cb` but its dep array is empty.
declare function useEffect(cb: () => void, deps?: unknown[]): void;
export const useProbe = (cb: () => void): void => {
  useEffect(() => {
    cb();
  }, []);
};
