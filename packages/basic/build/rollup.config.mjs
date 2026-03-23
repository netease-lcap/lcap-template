import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import { visualizer } from 'rollup-plugin-visualizer';
import terser from '@rollup/plugin-terser';
import isCI from 'is-ci';

export default {
	input: 'src/index.ts',
	output:  [
    {
      file: 'dist/index.js',
      format: 'umd',
      name: 'LcapBasicUtils',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({
      extensions: ['.ts', '.js', '.json'],
      browser: true,
      preferBuiltins: false,
    }),
    json(),
    commonjs(),
    typescript(),
    terser({
      compress: {
        drop_console: false,
        pure_funcs: [],
      },
      mangle: false, // 禁用变量名混淆，避免对已压缩代码的二次混淆问题
      format: {
        comments: false,
      },
    }),
    !isCI && visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
};