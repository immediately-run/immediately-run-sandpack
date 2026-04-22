/**
 * This module exports a placeholder string. At build time the
 * `rollup-inline-css-text` plugin rewrites the sentinel below with the
 * full extracted stylesheet so `getSandpackCssText()` keeps working for SSR.
 */
export const CSS_TEXT = "@@SANDPACK_INLINE_CSS_TEXT@@";
