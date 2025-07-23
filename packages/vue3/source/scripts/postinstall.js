const fs = require('fs');
const path = require('path');
const tar = require('tar');

async function main() {
  console.log('Running postinstall script...');

  const nodeModulesPath = path.resolve(__dirname, '../node_modules');
  const lcapModulesPath = path.resolve(__dirname, '../lcap_modules');
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = require(packageJsonPath);

  if (Object.keys(packageJson.lcap_modules).length > 0 && !fs.existsSync(lcapModulesPath)) {
    console.error(`Directory ${lcapModulesPath} does not exist.`);
    return;
  }

  const root = path.resolve(__dirname, '../');

  for (const moduleName of Object.keys(packageJson.lcap_modules)) {
    const value = packageJson.lcap_modules[moduleName];
    const tgz = path.resolve(root, value);

    const target = path.resolve(nodeModulesPath, moduleName);
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }

    try {
      await tar.x({
        file: tgz,
        cwd: target,
        strip: 1
      });
    } catch (error) {
      console.error(`Failed to extract ${tgz}`);
    }
  }

  console.log('Postinstall script completed successfully.');
}

main()
