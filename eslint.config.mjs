import js from "@eslint/js";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      globals: globals.browser,
    },
    plugins: {
      js,
      prettier: prettierPlugin,
      "@typescript-eslint": (await import("@typescript-eslint/eslint-plugin")).default,
    },
    extends: [
      "js/recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
      "plugin:prettier/recommended",
    ],
    rules: {
      "prettier/prettier": "error",
    },
  },
]);
