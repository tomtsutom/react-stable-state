import pluginTypescript from "@rollup/plugin-typescript";
import typescript from "@rollup/plugin-typescript";
import { babel as pluginBabel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

import * as path from "path";

import pkg from "./package.json";


export default [
  // For NPM
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist/commonjs",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      pluginTypescript({ outDir: "dist/commonjs" }),
      pluginBabel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      terser(),
    ],
  },
  // For ES6
  {
    input: "src/index.ts",
    output: {
      dir: "dist/es6",
      format: "es",
      exports: "named",
      sourcemap: true,
    },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      typescript({
        declaration: true,
        rootDir: "src",
        outDir: "dist/es6",
      }),
      pluginTypescript({ outDir: "dist/es6" }),
      pluginBabel({
        babelHelpers: "bundled",
        configFile: path.resolve(__dirname, ".babelrc.js"),
      }),
      terser(),
    ],
  },
];
