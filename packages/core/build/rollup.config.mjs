import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-polyfill-node';

export default {
	input: 'src/index.ts',
	output: [
    // {
    //   file: 'dist/index.js',
    //   format: 'umd',
    //   name: 'LcapCoreUtils',
    //   sourcemap: true,
    //   globals: {
    //     vue: 'Vue',
    //   }
    // }, 
    {
      file: 'esm/index.js',
      format: 'esm',
      sourcemap: true,
    }
  ],
  plugins: [
    resolve({
      extensions: ['.ts', '.js', '.json'],
    }),
    json(),
    typescript(),
    commonjs(),
    nodePolyfills(),
  ],
  external: ['vue'],
  treeshake: false
};