import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
export default {
  input: "src/index.ts",
  output: [
    // {
    //   file: `dist/index.js`,
    //   format: "umd",
    //   name: "CacheAPI",
    // },
    {
      file: `dist/index.js`,
      format: "cjs",
      exports: "auto",
    },
    {
      file: `dist/index.mjs`,
      format: "es",
    },
    // {
    //   file: `dist/index.d.ts`,
    //   format: "es",
    // },
    // {
    //   file: `dist/index.min.js`,
    //   format: "cjs",
    //   exports: "auto",
    //   plugins: [terser()],
    // },
    // {
    //   file: `dist/index.min.mjs`,
    //   format: "es",
    //   plugins: [terser()],
    // },
  ],
  plugins: [
    typescript({
      declaration: true,
      declarationDir: "dist/types",
    }),
    commonjs(),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/preset-env"],
    }),
  ],
};
