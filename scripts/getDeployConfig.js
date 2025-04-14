const fs = require('fs-extra');
const path = require('path');

function getDeployConfig(options = {}) {
  let config = {};
  const configPath = path.resolve(__dirname, '../lcap.deploy.json');
  if (fs.existsSync(configPath)) {
    config = require(configPath);
  } else {
    // 写入默认配置
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        platform: options.platform || 'platform',
        username: options.username || 'username',
        password: options.password || 'password',
      }),
    );
  }

  return config || {};
}

module.exports = getDeployConfig;
