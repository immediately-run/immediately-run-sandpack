import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
  {
    ignores: [
      "**/dist/**",
      "**/esm/**",
      "**/sandpack/**",
      "**/.next/**",
      "**/node_modules/**",
      "**/file-resolver-protocol.ts",
      "examples/**",
      "website/**",
      "**/*.stories.tsx",
      "**/*.stories.mdx",
      "**/*.test.ts",
      "**/*.test.tsx",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...tsPlugin.configs["eslint-recommended"].overrides?.[0]?.rules,
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-console": ["error", { allow: ["error", "warn"] }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-indexed-object-style": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/array-type": [
        "error",
        { default: "array-simple" },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "typeLike", format: ["PascalCase"] },
      ],
      "react/jsx-sort-props": [
        "error",
        {
          ignoreCase: true,
          reservedFirst: true,
          shorthandLast: true,
        },
      ],
      "react/jsx-boolean-value": "error",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "parent", "sibling"],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],
    },
  },
  prettierConfig,
];
