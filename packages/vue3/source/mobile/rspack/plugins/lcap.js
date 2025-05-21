const rspack = require('@rspack/core');

const plugin = 'lcap-plugin';

module.exports = class LcapPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    const { isIncremental, lastResource, extra } = this.options;


    // 增量发布
    if (isIncremental) {
      addIncrementalBuild(compiler, {
        lastResource,
      });

      return;
    }

    // 标准发布
    overrideRuntime(compiler);
    emitChunksMapResource(compiler);
    emitClintResource(compiler, {
      extra,
    });
  }
}

// 复写加载css\js chunk的函数
function overrideRuntime(compiler) {
  const { RuntimeModule, RuntimeGlobals } = compiler.webpack;

  // 复写__webpack_require__.k和__webpack_require__.u
  class OverrideRuntimeModule extends RuntimeModule {
    constructor() {
      super('override');
    }

    generate() {
      return `// override
      __webpack_require__.k = (chunkId) => {
        return "" + window.lcapChunksNameMap[chunkId] + "." + window.lcapChunksHashMap[chunkId] + ".css"
      }
      // override
      __webpack_require__.u = (chunkId) => {
        return "" + window.lcapChunksNameMap[chunkId] + "." + window.lcapChunksHashMap[chunkId] + ".js"
      }`;
    }
  }

  compiler.hooks.thisCompilation.tap(plugin, (compilation) => {
    compilation.hooks.runtimeRequirementInTree
      .for(RuntimeGlobals.ensureChunkHandlers)
      .tap(plugin, (chunk) => {
        if (chunk.name === 'runtime') {
          compilation.addRuntimeModule(chunk, new OverrideRuntimeModule());
        }
      });
  });
}

// 增加chunkMap资源
function emitChunksMapResource(compiler) {
  compiler.hooks.emit.tapAsync(plugin, (compilation, callback) => {
    // 2、增加router.min.js asset
    const ChunksNameMap = {};
    const ChunksHashMap = {};
    const statsJson = compilation.getStats().toJson({
      warnings: false,
      modules: false,
    });
    
    statsJson.chunks.forEach(chunk => {
      const chunkId = chunk.id;
      const chunkName = chunk.names[0];
      const chunkHash = chunk.hash.substring(0, 8);

      ChunksNameMap[chunkId] = chunkName || chunkId;
      ChunksHashMap[chunkId] = chunkHash;
    });

    const { RawSource } = compiler.webpack.sources;

    const code = `window.lcapChunksNameMap = ${JSON.stringify(ChunksNameMap)};
window.lcapChunksHashMap = ${JSON.stringify(ChunksHashMap)};`;

    compilation.emitAsset('router.min.js', new RawSource(Buffer.from(code)), { minimized: true })

    callback();
  })
}

// 生成client.js
function emitClintResource(compiler, options) {
  const { extra } = options;
  compiler.hooks.compilation.tap(plugin, compilation => {
      rspack.HtmlRspackPlugin.getCompilationHooks(compilation).beforeAssetTagGeneration.tapPromise(plugin, async data => {
        const { assets } = data;
        const { publicPath, js, css } = assets;

        const allJS = [
          ...js,
          ...(extra.js || []),
        ];

        const allCSS = [
          ...css,
          ...(extra.css || []),
        ];

        const clientCode = `(function() {
          function loadAssets() {
            // chunksMap
            window.LazyLoad.js(["${publicPath}router.min.js?t=" + Date.now()]);

            window.LazyLoad.js(${JSON.stringify(allJS)});
            window.LazyLoad.css(${JSON.stringify(allCSS)});
          }

          ${extra.entryCode}
        })();
        `
        compilation.emitAsset('client.js', new compiler.webpack.sources.RawSource(Buffer.from(clientCode)), { minimized: true });

        data.assets.js = [`${publicPath}client.js?t=${Date.now()}`];
        data.assets.css = [];
      });
    });
}

// 增量构建
function addIncrementalBuild(compiler, options) {
  const { lastResource } = options;
  const { chunksMap: chunksMapCode } = lastResource;

  compiler.hooks.emit.tapAsync(plugin, (compilation, callback) => {
    const statsJson = compilation.getStats().toJson({
      warnings: false,
      modules: false,
    });

    // 只保留pages相关的chunk 资源
    const pagesAssets = [];
    const changedChunkMap = {};

    statsJson.chunks.filter(chunk => {
      if (chunk.idHints?.includes('page')) {
        pagesAssets.push(...chunk.files);
        changedChunkMap[chunk.id] = {
          name: chunk.names[0] || chunk.id,
          hash: chunk.hash.substring(0, 8),
        }
      }
    });

    // 删除不需要的chunk(非页面相关的chunk)
    statsJson.assets.forEach(asset => {
      if (!pagesAssets.includes(asset.name)) {
        compilation.deleteAsset(asset.name);
      }
    })

    // 生成增量变更的chunks-map.js
    let code = chunksMapCode;
    for (const chunkId in changedChunkMap) {
      const { hash: chunkHash } = changedChunkMap[chunkId];
      const hashReg = new RegExp(`(["']?)${chunkId}(["']?):\\s?["']([0-9a-zA-Z]+)["']`, 'g');
      code = code
        .replace(hashReg, ($0, $1, $2) => `${$1}${chunkId}${$2}:"${chunkHash}"`);
    }
    const { RawSource } = compiler.webpack.sources;
    compilation.emitAsset('router.min.js', new RawSource(Buffer.from(code)), { minimized: true })

    callback();
  });
}