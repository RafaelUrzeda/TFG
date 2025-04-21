import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import globals from "globals";
import tsEslint from "typescript-eslint";

export default tsEslint.config({
  extends: [
    eslint.configs.recommended,
    ...tsEslint.configs.recommended,
    eslintConfigPrettier,
  ],
  plugins: {
    "typescript-eslint": tsEslint.plugin,
    "eslint-plugin-prettier": eslintPluginPrettier,
  },
  languageOptions: {
    globals: {
      ...globals.node,
      __ENV: "readonly"
    },
    parserOptions: {
      parser: tsEslint.parser,
      sourceType: "CommonJS",
    },
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-unused-expressions": "off",
  },
  ignores: ["coverage/**", "dist/**"],
});
