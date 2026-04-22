import { useCallback, useEffect, useState } from "react";

import { breakpoints } from "../../styles/breakpoints";

const stripScreenPrefix = (mq: string): string =>
  mq.replace(/^screen and /, "");

export const useBreakpoint = (
  breakpoint: keyof typeof breakpoints | string,
): boolean => {
  const [value, setValue] = useState(true);

  const checkBreakpoint = useCallback(() => {
    const raw =
      breakpoint in breakpoints
        ? breakpoints[breakpoint as keyof typeof breakpoints]
        : `(min-width: ${breakpoint}px)`;

    setValue(window.matchMedia(stripScreenPrefix(raw)).matches);
  }, [breakpoint]);

  useEffect(() => {
    checkBreakpoint();

    window.addEventListener("resize", checkBreakpoint);

    return (): void => {
      window.removeEventListener("resize", checkBreakpoint);
    };
  }, [checkBreakpoint]);

  return value;
};
