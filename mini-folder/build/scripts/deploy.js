
const upload = require("../../../scripts/upload");
const argv = require("minimist")(process.argv.slice(2));
const { miniRootDir, projects } = require('../config');

async function main() {
  for (const project of projects) {
    console.log(`Deploying ${project.name}...`)
    const root = `${miniRootDir}/.temp/${project.name}`
    const name = `@lcap/${project.name}-mini`
    const version = require(`${miniRootDir}/${project.name}/package.json`).version
    
    const platform = argv.platform
    const username = argv.username
    const password = argv.password
  
    const config = {
      root,
      name,
      version,
      platform,
      username,
      password,
    }
  
    await upload({
      ...config,
      source: {
        name: 'source.tgz',
        path: 'source/zip.tgz',
      }
    })
  
    await upload({
      ...config,
      source: {
        name: 'dist.tgz',
        path: 'dist/zip.tgz',
      }
    })
  
    console.log(`Deployed ${project.name}`)
  }
}

main()