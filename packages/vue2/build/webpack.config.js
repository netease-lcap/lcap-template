const path = require('path');
const isCI = require('is-ci');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyPlugin = require('copy-webpack-plugin');
const EsbuildPlugin = require('./plugins/esbuild-plugin');

const root = path.resolve(__dirname, '..');
const pkg = require(path.resolve(root, './package.json'));

const publicPath = '/';

const library = 'cloudAdminDesigner';

const extensions = ['.vue', '.js', '.ts', '.json', '.css'];

const isRelease = isCI || process.env.LCAP_RELEASE == 1;

const baseConfig = (type) => {
  return {
    mode: isRelease ? 'production' : 'development',
    context: path.resolve(root, 'src'),
    devtool: 'source-map',
    entry: [path.resolve(root, `./src/style/global.${type}.css`), path.resolve(root, './src/init.js')],
    output: {
      publicPath,
      path: path.resolve(root, `dist/${type}`),
      filename: `${library}.umd.min.js`,
      library: {
        name: library,
        type: 'umd',
        umdNamedDefine: true,
        export: 'default',
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
      },
      extensions: [...extensions, ...extensions.map((ext) => `.${type}${ext}`)],
    },
    externals: {
      vue: {
        root: 'Vue',
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue',
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'ts-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: ['autoprefixer'],
                },
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [
        new EsbuildPlugin({
          target: 'es2015',
          css: true,
        }),
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: require.resolve('process/browser'),
      }),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: `${library}.css`,
      }),
      new webpack.ProgressPlugin(),
      new CopyPlugin({
        patterns: [{ from: '../index.ftl' }],
      }),
      // new BundleAnalyzerPlugin({
      //   analyzerMode: "static",
      //   openAnalyzer: false,
      //   reportFilename: `report-${type}.html`,
      // }),
    ],
    stats: 'minimal',
  };
};

module.exports = [baseConfig('pc'), baseConfig('mobile')];

exports.baseConfig = baseConfig;
