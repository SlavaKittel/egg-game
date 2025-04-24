import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      "react/no-unknown-property": "off",
      "react/display-name": "off",
      "max-len": [
        "error",
        {
          code: 80,
          comments: 80,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
    },
  },
]);
