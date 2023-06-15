import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import tslib from "tslib";
export default {
  input: "lib/index.js",
  output: [
    {
      file: `dist/index.js`,
      format: "umd",
      name: "CacheAPI",
    },
    {
      file: `dist/index.cjs.js`,
      format: "cjs",
      exports: "auto",
    },
    {
      file: `dist/index.esm.js`,
      format: "es",
    },
  ],
  plugins: [
    typescript({ tslib }),
    terser(),
    resolve(),
    commonjs(),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/preset-env"],
    }),
  ],
};
