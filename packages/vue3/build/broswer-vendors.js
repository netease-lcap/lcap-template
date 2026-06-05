const path = require('path');
const { defineConfig } = require('@rspack/cli');
const rspack = require('@rspack/core');

const root = path.resolve(__dirname, '..');

const targets = ['last 2 versions', '> 0.2%', 'not dead', 'Firefox ESR'];

const env = 'development';

exports.vendorConfig = (type) =>
  defineConfig({
    mode: env,
    devtool: 'source-map',
    entry: {
      index: [path.resolve(__dirname, '../src/broswer-vendors.ts')],
    },
    target: 'web',
    output: {
      publicPath: '/',
      path: path.resolve(root, `dist/${type}`),
      filename: `broswer-vendors.js`,
      library: {
        name: 'LcapBrowserVendors',
        type: 'umd',
        umdNamedDefine: true,
      },
    },
    module: {
      rules: [
        {
          test: /\.[mc]?js$/,
          type: 'javascript/auto',
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                jsc: {
                  parser: {
                    syntax: 'ecmascript',
                  },
                },
              },
            },
          ],
        },
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                jsc: {
                  parser: {
                    syntax: 'typescript',
                  },
                },
                env: { targets },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      // new rspack.DefinePlugin({
      // })
    ],
    stats: 'minimal',
  });
