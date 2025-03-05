const path = require('path');
const rspack = require('@rspack/core');
const refreshPlugin = require('@rspack/plugin-react-refresh');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
// 会被替换成真实服务端地址，形如 http://dev.pagetest.defaulttenant.lcap.hatest.163yun.com
const backendUrl = '';
// 会被替换成真实publicPath，形如 '//minio-api.codewave-test.163yun.com/lowcode-static/defaulttenant/48bab4da-9671-4e27-9411-bcdb41cd16e4/dev'
const publicPath = '';
/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: {
    main: {
      import: './src/main.tsx',
    },
  },
  output: {
    publicPath: isDev ? '/' : publicPath,
    filename: '[name].[contenthash].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin({
        include: [/src\/packages/],
      }),
      new rspack.SwcCssMinimizerRspackPlugin(),
    ],
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
    alias: {},
  },
  devServer: {
    port: 8810,
    historyApiFallback: true,
    compress: false,
    proxy: {
      '/assets': {
        target: backendUrl,
        changeOrigin: true,
        autoRewrite: true,
      },
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        autoRewrite: true,
      },
      '/rest': {
        target: backendUrl,
        changeOrigin: true,
        autoRewrite: true,
      },
      '^/gateway/': {
        target: backendUrl,
        changeOrigin: true,
        autoRewrite: true,
      },
      '^/gw/': {
        target: backendUrl,
        changeOrigin: true,
        autoRewrite: true,
      },
      '^/upload': {
        target: backendUrl,
        changeOrigin: true,
        autoRewrite: true,
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: [/node_modules/, /src\/packages/],
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              sourceMap: false,
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets: ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new rspack.ProgressPlugin({}),
    // 构建标准的index.html
    new rspack.HtmlRspackPlugin({
      template: './index.html',
    }),
    isDev ? new refreshPlugin() : null,
    // 构建Codewave使用的client.js入口
    !isDev
      ? new HtmlWebpackPlugin({
          inject: false,
          template: './client-lazyload-template.js',
          filename: 'client.js',
          minify: false
        })
      : null,
  ].filter(Boolean),
};
