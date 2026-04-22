/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Replaces every `*.css.ts` import in the unstyled build with a module
 * whose named exports are all empty-string-returning callables.
 *
 * vanilla-extract's `style()` returns a class-name string and `recipe()`
 * returns a callable that takes a variants object and returns a class
 * string. Stitches' previous unstyled build surfaced empty class names for
 * both shapes; we keep that contract by exporting a callable Proxy that
 * coerces to "" when stringified and returns "" when called.
 */
const STUB_FACTORY = `
const __sandpackStub = (() => {
  const handler = {
    get(target, prop) {
      if (prop === Symbol.toPrimitive) return () => "";
      if (prop === "toString") return () => "";
      if (prop === "valueOf") return () => "";
      if (prop in target) return target[prop];
      return __sandpackStub;
    },
  };
  const fn = function stub() { return ""; };
  return new Proxy(fn, handler);
})();
`;

/**
 * Collects the names of `export const ...` and `export { ... }` declarations
 * in a `*.css.ts` source. The plan keeps `*.css.ts` files lint-clean and
 * limited to vanilla-extract primitives, so a regex pass is sufficient.
 */
function collectExportNames(code) {
  const names = new Set();
  let hasDefault = false;

  const constRe = /\bexport\s+(?:const|let|var|function|class|type|interface)\s+([A-Za-z_$][\w$]*)/g;
  let match;
  while ((match = constRe.exec(code)) !== null) {
    names.add(match[1]);
  }

  const groupRe = /\bexport\s*\{([^}]+)\}/g;
  while ((match = groupRe.exec(code)) !== null) {
    const inner = match[1];
    inner.split(",").forEach((part) => {
      const trimmed = part.trim();
      if (!trimmed) return;
      const aliasMatch = trimmed.match(/(?:\bas\s+)?([A-Za-z_$][\w$]*)\s*$/);
      if (!aliasMatch) return;
      const name = aliasMatch[1];
      if (name === "default") hasDefault = true;
      else names.add(name);
    });
  }

  if (/\bexport\s+default\b/.test(code)) hasDefault = true;

  return { names: Array.from(names), hasDefault };
}

module.exports = function stubCss() {
  return {
    name: "sandpack-unstyled-css-stub",
    transform(code, id) {
      if (!id.endsWith(".css.ts")) return null;

      const { names, hasDefault } = collectExportNames(code);

      const lines = [STUB_FACTORY];
      for (const name of names) {
        lines.push(`export const ${name} = __sandpackStub;`);
      }
      if (hasDefault) {
        lines.push(`export default __sandpackStub;`);
      }
      return { code: lines.join("\n"), map: { mappings: "" } };
    },
  };
};
