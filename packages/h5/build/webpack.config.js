const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const EsbuildPlugin = require('esbuild-minify');

const root = path.resolve(__dirname, '..');
const pkg = require(path.resolve(root, './package.json'));

const publicPath = '/';

const library = 'cloudAdminDesigner';

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: path.join(root, './src/init.js'),
    output: {
        publicPath,
        filename: `${library}.umd.min.js`,
        path: path.resolve(root, 'dist'),
        library: {
            name: library,
            type: 'umd',
            umdNamedDefine: true,
            export: 'default',
        },
    },
    resolve: {
        extensions: ['.vue', '.js', '.json'],
        alias: {
            '@': path.resolve(root, 'src'),
        },
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
                test: /\.(j|t)s$/,
                loader: 'swc-loader',
                options: {
                    jsc: {
                        parser: {
                            syntax: 'typescript',
                            tsx: false,
                        },
                        loose: false,
                    },
                },
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
        new CleanWebpackPlugin(),
        // new BundleAnalyzerPlugin(),
    ],
    stats: 'minimal',
};
