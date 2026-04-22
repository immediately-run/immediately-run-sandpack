/**
 * Media query strings for responsive styling.
 *
 * These mirror the Stitches `media` configuration that previously lived in
 * `stitches.config.ts` and are spelled as raw CSS condition strings so they
 * can be used as keys inside vanilla-extract `@media` blocks:
 *
 * ```ts
 * style({
 *   "@media": {
 *     [bp1]: { width: "384px" },
 *   },
 * });
 * ```
 */
export const SCREEN_SIZES = {
  sm: 375,
  md: 768,
  lg: 1040,
  xl: 1920,
};

export const bp1 = `screen and (min-width: ${SCREEN_SIZES.md}px)`;
export const bp2 = `screen and (min-width: ${SCREEN_SIZES.lg}px)`;
export const bp3 = `screen and (min-width: ${SCREEN_SIZES.xl}px)`;

export const breakpoints = { bp1, bp2, bp3 } as const;
