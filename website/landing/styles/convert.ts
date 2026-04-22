/* eslint-disable @typescript-eslint/no-explicit-any */
import { globalStyle, style } from "@vanilla-extract/css";

import { breakpoints } from "./breakpoints";
import { vars } from "./vars.css";

/**
 * Maps a CSS property to the theme scale Stitches looked up tokens against.
 * Mirrors the configuration that previously lived in `stitches.config.ts`.
 */
const PROPERTY_SCALES: Record<string, keyof typeof vars> = {
  color: "colors",
  background: "colors",
  backgroundColor: "colors",
  borderColor: "colors",
  borderTopColor: "colors",
  borderRightColor: "colors",
  borderBottomColor: "colors",
  borderLeftColor: "colors",
  fill: "colors",
  stroke: "colors",
  outlineColor: "colors",
  caretColor: "colors",
  fontFamily: "fonts",
  fontWeight: "fontWeights",
  transition: "transitions",
};

const SCALE_PREFIX_MAP: Record<string, keyof typeof vars> = {
  colors: "colors",
  color: "colors",
  fonts: "fonts",
  fontFamilies: "fonts",
  fontWeights: "fontWeights",
  transitions: "transitions",
};

const resolveSingleToken = (
  property: string,
  rawValue: string,
): string | undefined => {
  if (!rawValue.startsWith("$")) return undefined;

  const stripped = rawValue.slice(1);

  if (stripped.startsWith("$")) {
    return `var(--${stripped.slice(1)})`;
  }

  if (stripped.includes("$")) {
    const [scaleName, key] = stripped.split("$");
    const scale = SCALE_PREFIX_MAP[scaleName];
    if (scale) {
      const scaleVars = vars[scale] as Record<string, string>;
      if (scaleVars && scaleVars[key]) return scaleVars[key];
    }
  }

  const scaleName = PROPERTY_SCALES[property];
  if (!scaleName) return undefined;
  const scaleVars = vars[scaleName] as Record<string, string>;
  return scaleVars?.[stripped];
};

/**
 * Replaces every `$token` / `$$customProp` reference in `rawValue` with the
 * resolved value, leaving any literal text in place. Returns `undefined` if
 * nothing changed so callers can short-circuit to the original value.
 */
const lookupToken = (
  property: string,
  rawValue: string,
): string | undefined => {
  if (!rawValue.includes("$")) return undefined;

  const single = resolveSingleToken(property, rawValue);
  if (single !== undefined) return single;

  let didReplace = false;
  const replaced = rawValue.replace(
    /\$\$?[A-Za-z_][\w-]*(?:\$[A-Za-z_][\w-]*)?/g,
    (match) => {
      const resolved = resolveSingleToken(property, match);
      if (resolved !== undefined) {
        didReplace = true;
        return resolved;
      }
      // Stitches falls back to a plain `var(--identifier)` for any
      // unresolved single-`$` reference; mirror that so transforms like
      // `transform: "scale($progress)"` keep working.
      if (match.startsWith("$") && !match.startsWith("$$")) {
        didReplace = true;
        return `var(--${match.slice(1)})`;
      }
      return match;
    },
  );

  return didReplace ? replaced : undefined;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const isMediaKey = (key: string): boolean =>
  key === "@bp1" || key === "@bp2" || key === "@bp3";

const mediaQueryFor = (key: string): string =>
  key === "@bp1"
    ? breakpoints.bp1
    : key === "@bp2"
      ? breakpoints.bp2
      : breakpoints.bp3;

const normalizeSelector = (selector: string): string => {
  if (selector.startsWith("&")) return selector;
  if (
    selector.startsWith(">") ||
    selector.startsWith("+") ||
    selector.startsWith("~")
  ) {
    return `& ${selector}`;
  }
  return `& ${selector}`;
};

interface Bucket {
  base: Record<string, any>;
  selectors: Record<string, Record<string, any>>;
  media: Record<string, Bucket>;
}

const newBucket = (): Bucket => ({ base: {}, selectors: {}, media: {} });

const convertObject = (
  config: Record<string, unknown>,
  bucket: Bucket,
): void => {
  for (const [rawKey, rawValue] of Object.entries(config)) {
    if (rawValue === undefined || rawValue === null) continue;

    if (isMediaKey(rawKey) && isPlainObject(rawValue)) {
      const mq = mediaQueryFor(rawKey);
      if (!bucket.media[mq]) bucket.media[mq] = newBucket();
      convertObject(rawValue, bucket.media[mq]);
      continue;
    }

    if (isPlainObject(rawValue)) {
      const selector = normalizeSelector(rawKey);
      bucket.selectors[selector] = bucket.selectors[selector] ?? {};
      // Selector contents only support flat property declarations in
      // vanilla-extract; flatten any nested media/selectors lossily.
      const inner = newBucket();
      inner.base = bucket.selectors[selector];
      convertObject(rawValue, inner);
      Object.assign(bucket.selectors[selector], inner.base);
      continue;
    }

    const propertyKey = rawKey.startsWith("$$")
      ? `--${rawKey.slice(2)}`
      : rawKey;

    if (typeof rawValue === "string") {
      const replaced = lookupToken(rawKey, rawValue);
      bucket.base[propertyKey] = replaced ?? rawValue;
      continue;
    }

    bucket.base[propertyKey] = rawValue;
  }
};

const bucketToRule = (bucket: Bucket): Record<string, any> => {
  const result: Record<string, any> = { ...bucket.base };
  if (Object.keys(bucket.media).length) {
    const mediaBlock: Record<string, Record<string, any>> = {};
    for (const [mq, sub] of Object.entries(bucket.media)) {
      mediaBlock[mq] = bucketToRule(sub);
    }
    result["@media"] = mediaBlock;
  }
  if (Object.keys(bucket.selectors).length) {
    result.selectors = bucket.selectors;
  }
  return result;
};

/**
 * Converts a Stitches-style style object into a vanilla-extract `StyleRule`.
 *
 * Supports:
 * - `$token` references resolved against the landing theme contract
 *   (`vars.colors.primary`, `vars.fonts.base`, etc.).
 * - `$$customProp` Stitches-locally-scoped CSS variables, mapped to plain
 *   `--customProp` declarations and `var(--customProp)` reads.
 * - `@bp1` / `@bp2` / `@bp3` media-query keys, hoisted into vanilla-extract's
 *   `@media` block.
 * - Nested selectors (`&:hover`, `> .foo`, `code`, etc.), promoted to the
 *   `selectors` block with an inserted `&` so they reference the parent class.
 *
 * Variants are handled separately by `convertVariants` and consumed by
 * `recipe()`.
 */
export const convert = (
  config: Record<string, unknown>,
): Record<string, any> => {
  const bucket = newBucket();
  convertObject(config, bucket);
  return bucketToRule(bucket);
};

/**
 * Splits a converted rule into the `self` portion (suitable for `style()` or
 * `recipe()` `base`) and a list of descendant rules that must be emitted via
 * `globalStyle()` once the owning class name exists.
 */
const isSelfSelector = (selector: string): boolean => {
  // Selectors that only match the element itself (no descendant combinator).
  // `&:hover`, `&[data-foo]`, `&.bar`, `&::after` etc.
  if (!selector.startsWith("&")) return false;
  return !/\s|>|\+|~/.test(selector.slice(1));
};

interface SplitRule {
  self: Record<string, any>;
  descendants: Array<{ selector: string; rule: Record<string, any> }>;
}

const splitSelectors = (rule: Record<string, any>): SplitRule => {
  const self: Record<string, any> = {};
  const descendants: SplitRule["descendants"] = [];

  for (const [key, value] of Object.entries(rule)) {
    if (key === "selectors" && isPlainObject(value)) {
      const keptSelectors: Record<string, any> = {};
      for (const [selector, selectorRule] of Object.entries(value)) {
        if (isSelfSelector(selector)) {
          keptSelectors[selector] = selectorRule;
        } else {
          descendants.push({
            selector,
            rule: selectorRule as Record<string, any>,
          });
        }
      }
      if (Object.keys(keptSelectors).length) self.selectors = keptSelectors;
      continue;
    }

    if (key === "@media" && isPlainObject(value)) {
      const keptMedia: Record<string, any> = {};
      for (const [mq, mediaRule] of Object.entries(value)) {
        const split = splitSelectors(mediaRule as Record<string, any>);
        keptMedia[mq] = split.self;
        for (const { selector, rule: innerRule } of split.descendants) {
          descendants.push({
            selector,
            rule: { "@media": { [mq]: innerRule } },
          });
        }
      }
      self["@media"] = keptMedia;
      continue;
    }

    self[key] = value;
  }

  return { self, descendants };
};

/**
 * Emits `globalStyle()` rules for every descendant selector against the
 * supplied class name.
 */
const emitDescendants = (
  className: string,
  descendants: SplitRule["descendants"],
): void => {
  for (const { selector, rule } of descendants) {
    const suffix = selector.startsWith("&")
      ? selector.slice(1).replace(/^\s+/, " ")
      : ` ${selector}`;
    globalStyle(`.${className}${suffix.startsWith(" ") ? suffix : ` ${suffix}`}`, rule);
  }
};

/**
 * Like `style(convert(config))`, but automatically extracts descendant
 * selectors (e.g. `".sp-cm"`, `"> div"`) into `globalStyle()` calls scoped to
 * the produced class name. This lets callers keep Stitches' nested-selector
 * ergonomics while complying with vanilla-extract's local-class rules.
 */
export const styleBlock = (config: Record<string, unknown>): string => {
  const rule = convert(config);
  const split = splitSelectors(rule);
  const className = style(split.self);
  emitDescendants(className, split.descendants);
  return className;
};

/**
 * Converts a Stitches `variants:` block into the variants shape expected by
 * `@vanilla-extract/recipes`'s `recipe()`.
 */
export const convertVariants = (
  variants: Record<string, Record<string, Record<string, unknown>>>,
): Record<string, Record<string, Record<string, any>>> => {
  const result: Record<string, Record<string, Record<string, any>>> = {};
  for (const [variantName, options] of Object.entries(variants)) {
    result[variantName] = {};
    for (const [optionName, optionValue] of Object.entries(options)) {
      result[variantName][optionName] = convert(optionValue);
    }
  }
  return result;
};
