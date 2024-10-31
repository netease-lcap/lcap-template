const upload = require('lcap/lib/upload');
const path = require('path');

module.exports = function (config) {
  const { root, name, version, source, platform, username, password } = config;
  const sourcePath = path.resolve(root, source.path);
  const prefix = `packages/${name}@${version}`;
  let formFiles = [{
    name: path.posix.join(prefix, source.name),
    path: sourcePath,
  }];

  return upload(formFiles, {
    platform: platform,
    username: username,
    password: password,
  })
    .then(() => {
      console.log(`上传成功`);
    })
    .catch(() => {
      throw new Error("上传失败");
    })
}