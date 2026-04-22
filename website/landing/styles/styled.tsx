/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

type RecipeFn = ((variants?: any) => string) & { variants?: () => string[] };

type ClassNameInput = string | RecipeFn | undefined | null | false;

const resolveClassName = (input: ClassNameInput, variants?: any): string => {
  if (!input) return "";
  if (typeof input === "function") return input(variants) ?? "";
  return input;
};

const inferVariantKeys = (input: ClassNameInput): string[] => {
  if (typeof input === "function" && typeof input.variants === "function") {
    try {
      return input.variants();
    } catch {
      return [];
    }
  }
  return [];
};

const cx = (...parts: Array<string | undefined | null | false>): string =>
  parts.filter(Boolean).join(" ");

/**
 * Tiny shim that mirrors Stitches' `styled(tag, ...)` API but is backed by
 * vanilla-extract class names instead of runtime CSS-in-JS.
 *
 * Usage:
 *
 * ```ts
 * // Foo.css.ts
 * export const fooBase = style({ color: "red" });
 *
 * // Foo.tsx
 * export const Foo = styled("div", fooBase);
 * ```
 *
 * Recipes (functions returning a class string) are also supported; props
 * matching their variant keys are forwarded to the recipe and stripped from
 * the underlying DOM element when consumers pass them as React props.
 */
export const styled = <T extends React.ElementType, V extends object = {}>(
  tag: T,
  className?: ClassNameInput,
  explicitVariantKeys?: ReadonlyArray<keyof V>,
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<
    Omit<React.ComponentPropsWithoutRef<T>, keyof V> &
      Partial<V> & { as?: React.ElementType; css?: unknown }
  > &
    React.RefAttributes<unknown>
> => {
  const variantKeys = (explicitVariantKeys ??
    inferVariantKeys(className)) as ReadonlyArray<string>;
  const variantKeySet = new Set<string>(variantKeys);

  const Component = React.forwardRef<unknown, any>((rawProps, ref) => {
    const variants: Record<string, unknown> = {};
    const rest: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(rawProps)) {
      if (variantKeySet.has(key)) {
        variants[key] = value;
      } else {
        rest[key] = value;
      }
    }

    const {
      className: incoming,
      css: _ignoredCss,
      as: asTag,
      ...other
    } = rest as {
      className?: string;
      css?: unknown;
      as?: React.ElementType;
      [key: string]: unknown;
    };

    const merged = cx(resolveClassName(className, variants), incoming);

    return React.createElement(
      (asTag ?? (tag as React.ElementType)) as React.ElementType,
      {
        ref,
        className: merged || undefined,
        ...other,
      },
    );
  });

  Component.displayName =
    typeof tag === "string" ? `styled(${tag})` : "styled(Component)";

  return Component as any;
};

/**
 * Composes any number of class-name inputs (string, recipe call, or `false`).
 */
export const classes = cx;
