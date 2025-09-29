const path = require('path');
const deploy = require('../../../scripts/deploy');
const argv = require('minimist')(process.argv.slice(2));
const { miniRootDir, projects } = require('../config');

async function main() {
  for (const project of projects) {
    console.log(`Deploying ${project.name}...`);
    const root = path.resolve(__dirname, '..');

    const projectRoot = path.resolve(miniRootDir, project.name);
    const packageJson = require(`${projectRoot}/package.json`);
    const version = packageJson.version;
    const name = `@lcap/${packageJson.name}`;

    const platform = argv.platform;
    const username = argv.username;
    const password = argv.password;

    const config = {
      root,
      name,
      version,
      platform,
      username,
      password,
    };

    await deploy({
      ...config,
      dest: `dist/${project.name}`,
    });

    console.log(`Deployed ${project.name}`);
  }
}

main();
