import {
  browser,
  common,
  edge,
  next,
  node,
  prettier,
  react,
  typescript,
} from "eslint-config-neon";
import merge from "lodash.merge";

/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
const config = [
  ...[
    ...common,
    ...browser,
    ...node,
    ...typescript,
    ...react,
    ...next,
    ...edge,
    ...prettier,
  ].map((config) =>
    merge(config, {
      files: ["src/**/*.ts", "src/**/*.tsx"],
      settings: {
        react: {
          version: "detect",
        },
      },
      languageOptions: {
        parserOptions: {
          project: "tsconfig.json",
        },
      },
    })
  ),
];

export default config;
