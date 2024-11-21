const upload = require("lcap/lib/upload");
const path = require("path");
const getDeployConfig = require("./getDeployConfig");

module.exports = function (config) {
  const { root, name, version, source, platform, username, password } = config;
  const sourcePath = path.resolve(root, source.path);
  const prefix = `packages/${name}@${version}`;
  let formFiles = [
    {
      name: path.posix.join(prefix, source.name),
      path: sourcePath,
    },
  ];

  const defaultConfig = getDeployConfig(config);

  return upload(formFiles, {
    platform: platform || defaultConfig.platform,
    username: username || defaultConfig.username,
    password: password || defaultConfig.password,
  })
    .then(() => {
      console.log(`上传成功`);
    })
    .catch(() => {
      throw new Error("上传失败");
    });
};
