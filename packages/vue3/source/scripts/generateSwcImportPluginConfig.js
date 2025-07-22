function generateSwcImportPluginConfig(libs) {
  let config = {}

  libs.forEach(lib => {
    // 读取包目录下的manifest.json文件
    const manifestPath = `${lib}/manifest.json`;
    try {
      const manifest = require(manifestPath);
      if (manifest && manifest.modules) {
        const modules = manifest.modules.find(x => x.endsWith('/modules.json'));
        if (modules) {
          const modulesPath = `${lib}/${modules}`;
          config[lib] = {
            esDir: 'es',
            modules: require(modulesPath).exports,
          }
        }
      } else {
        console.warn(`Manifest in ${manifestPath} does not contain a valid name.`);
      }
    } catch (error) {
      console.error(`Error reading manifest from ${manifestPath}:`, error);
    }

  })

  return config;
}

module.exports = generateSwcImportPluginConfig;
