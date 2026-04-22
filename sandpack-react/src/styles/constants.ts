/**
 * @category Theme
 *
 * Prefix used for every generated CSS variable and component class name.
 * Kept in a standalone module so it can be safely imported from both runtime
 * code and `*.css.ts` files (which are processed at build time by
 * vanilla-extract and therefore must avoid importing larger graphs).
 */
export const THEME_PREFIX = "sp";
