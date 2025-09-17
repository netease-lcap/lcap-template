const rspack = require('@rspack/core');

const plugin = 'lcap-plugin';

module.exports = class LcapPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    const { isDev, isIncremental, lastResource, extra } = this.options;

    // 增量发布
    if (isIncremental) {
      addIncrementalBuild(compiler, {
        lastResource,
      });

      return;
    }

    // 标准发布
    overrideRuntime(compiler, {
      isDev,
    });
    emitChunksMapResource(compiler, {
      isDev,
    });
    emitClientResource(compiler, {
      isDev,
      extra,
    });
  }
}

// 复写加载css\js chunk的函数
function overrideRuntime(compiler, options) {
  const { isDev } = options;

  if (!isDev) {
    return;
  }

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
function emitChunksMapResource(compiler, options) {
  const { isDev } = options;

  if (!isDev) {
    return;
  }

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
window.lcapChunksHashMap = ${JSON.stringify(ChunksHashMap)};

var lcap_changed_chunks = [];

// lcap_changed_chunks placeholder

lcap_changed_chunks.forEach(item => {
  window.lcapChunksNameMap[item.id] = item.name;
  window.lcapChunksHashMap[item.id] = item.hash;
});`;

    compilation.emitAsset('router.min.js', new RawSource(Buffer.from(code)), { minimized: true })

    callback();
  })
}

// 生成client.js
function emitClientResource(compiler, options) {
  const { isDev, extra } = options;
  compiler.hooks.compilation.tap(plugin, compilation => {
      rspack.HtmlRspackPlugin.getCompilationHooks(compilation).beforeAssetTagGeneration.tapPromise(plugin, async data => {
        const { assets } = data;
        const { publicPath, js, css } = assets;

        const allJS = [
          ...(extra.preJS || []),
          ...js,
          ...(extra.postJS || []),
        ];

        const allCSS = [
          ...(extra.preCSS || []),
          ...css,
          ...(extra.postCSS || []),
        ];

        const clientCode = `(function() {
          function loadAssets() {
            // chunksMap
            ${isDev} && window.LazyLoad.js(["${publicPath}router.min.js?t=" + Date.now()]);

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
    const changedChunks = [];

    statsJson.chunks.filter(chunk => {
      if (chunk.idHints?.includes('page')) {
        pagesAssets.push(...chunk.files);
        changedChunks.push({
          id: chunk.id,
          name: chunk.names[0] || chunk.id,
          hash: chunk.hash.substring(0, 8),
        });
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

    const placeholderIdx = code.indexOf('// lcap_changed_chunks placeholder');
    // 前面插入代码
    if (placeholderIdx !== -1) {
      code = code.slice(0, placeholderIdx) + `lcap_changed_chunks.push(...${JSON.stringify(changedChunks)});\n` + code.slice(placeholderIdx);
    }

    const { RawSource } = compiler.webpack.sources;
    compilation.emitAsset('router.min.js', new RawSource(Buffer.from(code)), { minimized: true })

    callback();
  });
}
