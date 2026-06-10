const path = require("path");
const crypto = require('crypto');
const { defineConfig } = require('@rspack/cli');
const rspack = require('@rspack/core');
const { VueLoaderPlugin } = require('vue-loader');

const ClientLazyloadTemplate = require('./client-lazyload-template');
const LcapPlugin = require('./rspack/plugins/lcap');
const MissingCssFallbackPlugin = require('./rspack/plugins/missing-css-fallback');
const MissingFileFallbackPlugin = require('./rspack/plugins/missing-file-fallback');

// 会被替换成真实服务端地址，形如 http://dev.pagetest.defaulttenant.lcap.hatest.163yun.com
const backendUrl = '';
// 会被替换成真实publicPath，形如 '//minio-api.codewave-test.163yun.com/lowcode-static/defaulttenant/48bab4da-9671-4e27-9411-bcdb41cd16e4/dev'
const publicPath = '';
// 是否是开发环境
const isDev = false;

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["last 2 versions", "> 0.2%", "not dead", "Firefox ESR"];

module.exports = defineConfig({
	mode: isDev ? "development" : "production",
	context: __dirname,
	devtool: false, // source-map
	entry: {
		main: "./src/main.ts"
	},
	output: {
		clean: true,
		publicPath: publicPath,
		filename: '[name].[chunkhash:8].js',
		chunkFilename: '[name].[chunkhash:8].js',
	},
	resolve: {
		extensions: ["...", '.mjs', ".ts", ".vue"],
		alias: {
			"@": path.resolve(__dirname, './src'),
		}
	},
  externals: {},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					experimentalInlineMatchResource: true
				}
			},
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
                // swc plugin placeholder
              },
            },
          }
        ],
			},
			{
				test: /\.ts$/,
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "typescript"
								},
                // swc plugin placeholder
							},
							env: { targets }
						},
					}
				]
			},
			{
				test: /\.svg/,
				type: "asset/resource"
			}
		]
	},
	plugins: [
    new VueLoaderPlugin(),
		new rspack.HtmlRspackPlugin({
			template: "./index.html",
			publicPath: publicPath,
			inject: 'body',
		}),
		new rspack.DefinePlugin({
			'process.env.NODE_ENV': isDev ? JSON.stringify('development') : JSON.stringify('production'),
      'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
		}),
    new MissingCssFallbackPlugin({
      pattern: /\/dist-theme\/index\.css$/,
      fallbackContent: '/* CSS theme file not found, using empty fallback */'
    }),
    new MissingFileFallbackPlugin(),
    // LcapPlugin start
		new LcapPlugin({
      isDev,
			// 是否增量编译
			isIncremental: false,
			// 上一次的编译结果
			lastResource: {
				chunksMap: '',
			},
			extra: ClientLazyloadTemplate,
		}),
    // LcapPlugin end
	],
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			minSize: 0,

			cacheGroups: {
				page: {
					test: /src[\\/]pages[\\/]/,
					name: (module, chunks, cacheGroupKey) => {
						const resource = module.resource;
						let modulePath = /[\\/]pages[\\/](.*)\.vue?/.exec(resource)[1];
						const moduleName = crypto.createHash('sha256').update(modulePath).digest('hex').slice(0, 8);
            return `${cacheGroupKey}_${moduleName}`;
					},
					enforce: true,
					priority: 5,
				},
				routes: {
					test: /src[\\/]router\.ts/,
					name: 'routes',
					enforce: true,
					priority: 4,
				},
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					enforce: true,
					priority: 2,
				},
        source: {
					test: /[\\/]src[\\/]/,
					name: 'source',
					enforce: true,
					priority: 1,
				},
			}
		},
		minimize: !isDev, // 压缩, 会耗时
		minimizer: [
			new rspack.SwcJsMinimizerRspackPlugin(),
			new rspack.LightningCssMinimizerRspackPlugin({
				minimizerOptions: { targets }
			})
		],
	},
	experiments: {
		css: true
	},
	stats: 'minimal',
	devServer: {
    port: 8810,
		historyApiFallback: true,
    compress: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: [
      {
        context: ["/assets", "/api", "/rest", "/gateway", "/gw", "/upload"],
        target: backendUrl,
        changeOrigin: true,
      },
    ],
  },
});
