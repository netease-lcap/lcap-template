const path = require('path');
const fs = require('fs');
const tar = require('tar');

async function main() {
  const root = path.resolve(__dirname, '..');
  const distDir = path.resolve(root, 'dist');
  const outFile = path.resolve(root, 'zip.tgz');

  if (fs.existsSync(outFile)) {
    fs.unlinkSync(outFile);
  }

  await tar.c(
    {
      gzip: true,
      file: outFile,
      cwd: root,
      prefix: 'package',
    },
    ['dist/', 'typings/', 'README.md', 'package.json'],
  );

  // move to dist
  fs.renameSync(outFile, path.resolve(distDir, 'zip.tgz'));
  console.log('Created zip.tgz in dist folder');
}

main();
