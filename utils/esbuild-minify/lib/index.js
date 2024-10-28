const { transform: defaultEsbuildTransform } = require('esbuild');
const { RawSource: WP4RawSource, SourceMapSource: WP4SourceMapSource } = require('webpack-sources');
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');


const isJsFile = /\.[cm]?js(?:\?.*)?$/i;
const isCssFile = /\.css(?:\?.*)?$/i;
const pluginName = 'EsbuildPlugin';

const transformAssets = async (options, transform, compilation, useSourceMap) => {
    const { compiler } = compilation;
    const sources = 'webpack' in compiler && compiler.webpack.sources;
    const SourceMapSource = sources ? sources.SourceMapSource : WP4SourceMapSource;
    const RawSource = sources ? sources.RawSource : WP4RawSource;

    const { css: minifyCss, include, exclude, implementation, ...transformOptions } = options;

    const minimized = transformOptions.minify || transformOptions.minifyWhitespace || transformOptions.minifyIdentifiers || transformOptions.minifySyntax;

    const assets = compilation.getAssets().filter(
        (asset) =>
            // Filter out already minimized
            !asset.info.minimized &&
            // Filter out by file type
            (isJsFile.test(asset.name) || (minifyCss && isCssFile.test(asset.name))) &&
            ModuleFilenameHelpers.matchObject(
                {
                    include,
                    exclude,
                },
                asset.name
            )
    );

    await Promise.all(
        assets.map(async (asset) => {
            const assetIsCss = isCssFile.test(asset.name);
            let source;
            let map = null;
            if (useSourceMap) {
                if (asset.source.sourceAndMap) {
                    const sourceAndMap = asset.source.sourceAndMap();
                    source = sourceAndMap.source;
                    map = sourceAndMap.map;
                } else {
                    source = asset.source.source();
                    if (asset.source.map) {
                        map = asset.source.map();
                    }
                }
            } else {
                source = asset.source.source();
            }
            const sourceAsString = source.toString();
            const result = await transform(sourceAsString, {
                ...transformOptions,
                loader: assetIsCss ? 'css' : transformOptions.loader,
                sourcemap: useSourceMap,
                sourcefile: asset.name,
            });

            if (result.legalComments) {
                compilation.emitAsset(`${asset.name}.LEGAL.txt`, new RawSource(result.legalComments));
            }

            compilation.updateAsset(
                asset.name,
                // @ts-expect-error complex webpack union type for source
                result.map
                    ? new SourceMapSource(
                          result.code,
                          asset.name,
                          // @ts-expect-error it accepts strings
                          result.map,
                          sourceAsString,
                          map,
                          true
                      )
                    : new RawSource(result.code),
                {
                    ...asset.info,
                    minimized,
                }
            );
        })
    );
};

class EsbuildPlugin {
    constructor(options = {}) {
        const { implementation } = options;
        if (implementation && typeof implementation.transform !== 'function') {
            throw new TypeError(`[${pluginName}] implementation.transform must be an esbuild transform function. Received ${typeof implementation.transform}`);
        }

        this.options = options;
    }

    apply(compiler) {
        const { implementation, ...options } = this.options;
        const transform = implementation?.transform ?? defaultEsbuildTransform;

        /**
         * Enable minification by default if used in the minimizer array
         * unless further specified in the options
         */
        const usedAsMinimizer = compiler.options.optimization?.minimizer?.includes?.(this);
        if (usedAsMinimizer && !('minify' in options || 'minifyWhitespace' in options || 'minifyIdentifiers' in options || 'minifySyntax' in options)) {
            options.minify = compiler.options.optimization?.minimize;
        }

        compiler.hooks.compilation.tap(pluginName, (compilation) => {
            const meta = JSON.stringify({
                name: 'esbuild-loader',
                version: '1.0.0',
                options,
            });

            compilation.hooks.chunkHash.tap(pluginName, (_, hash) => hash.update(meta));

            /**
             * Check if sourcemaps are enabled
             * Webpack 4: https://github.com/webpack/webpack/blob/v4.46.0/lib/SourceMapDevToolModuleOptionsPlugin.js#L20
             * Webpack 5: https://github.com/webpack/webpack/blob/v5.75.0/lib/SourceMapDevToolModuleOptionsPlugin.js#LL27
             */
            let useSourceMap = false;

            /**
             * `finishModules` hook is called after all the `buildModule` hooks are called,
             * which is where the `useSourceMap` flag is set
             * https://webpack.js.org/api/compilation-hooks/#finishmodules
             */
            compilation.hooks.finishModules.tap(pluginName, (modules) => {
                const firstModule = Array.isArray(modules) ? modules[0] : modules.values().next().value;
                if (firstModule) {
                    useSourceMap = firstModule.useSourceMap;
                }
            });

            compilation.hooks.optimizeChunkAssets.tapPromise(pluginName, () => transformAssets(options, transform, compilation, useSourceMap));
        });
    }
}

module.exports = EsbuildPlugin;
