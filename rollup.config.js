import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "umd",
      name: "CacheAPI",
    },
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "auto",
    },
    {
      file: "dist/index.esm.js",
      format: "es",
    },
  ],
  plugins: [
    terser(),
    resolve(),
    commonjs(),
    babel({
      exclude: "node_modules/**",
      presets: ["@babel/preset-env"],
    }),
  ],
};
