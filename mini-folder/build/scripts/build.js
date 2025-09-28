const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const tar = require('tar');
const { miniRootDir, projects } = require('../config');

async function main() {
  // run package build tasks
  for (const project of projects) {
    console.log(`Building ${project.name}...`);
    execSync(`cd ${miniRootDir}/${project.name} && npm run ${project.build}`);
    console.log(`Built ${project.name}`);
  }

  const distDir = path.resolve(__dirname, '..', 'dist');

  // clear dist
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
  }
  fs.mkdirSync(distDir);

  for (const project of projects) {
    console.log(`Packaging ${project.name}...`);

    const target = path.resolve(distDir, project.name);

    if (!fs.existsSync(target)) {
      fs.mkdirSync(target);
    }

    // zip dist
    await tar.c(
      {
        gzip: true,
        file: path.resolve(target, 'dist.tgz'),
        cwd: path.resolve(miniRootDir, project.name, project.output),
        prefix: 'package',
      },
      ['.'],
    );

    // zip source
    await tar.c(
      {
        gzip: true,
        file: path.resolve(target, 'source.tgz'),
        cwd: path.resolve(miniRootDir, project.name),
        prefix: 'package',
        filter: (path) => {
          const excludes = project.excludes || [];

          if (excludes.some((e) => path.includes(e))) {
            console.log(`Excluding ${path}`);
            return false;
          }

          return true;
        },
      },
      ['.'],
    );
  }
}

main();
