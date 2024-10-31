const { execSync } = require('child_process');
const fs = require('fs');
const { miniRootDir, projects } = require('../config');


for (const project of projects) {
  console.log(`Building ${project.name}...`)
  execSync(`cd ${miniRootDir}/${project.name} && npm run ${project.build}`)
  console.log(`Built ${project.name}`)
}

execSync(`rm -rf ${miniRootDir}/.temp`)

for (const project of projects) {
  console.log(`Packaging ${project.name}...`)
  // copy dist -> tempDist
  const tempDist = `${miniRootDir}/.temp/${project.name}/dist`
  execSync(`mkdir -p ${tempDist}/package`)
  execSync(`cp -r ${miniRootDir}/${project.name}/${project.output}/* ${tempDist}/package`)
  execSync(`tar -cvzf ${tempDist}/zip.tgz -C ${tempDist} package`)
  execSync(`rm -rf ${tempDist}/package`)

  // copy source -> tempSource
  const tempSource = `${miniRootDir}/.temp/${project.name}/source`
  execSync(`mkdir -p ${tempSource}/package`)
  execSync(`cp -r -l ${miniRootDir}/${project.name}/* ${tempSource}/package`)
  const excludes = project.excludes.map(e => `--exclude=${e}`).join(' ')
  execSync(`tar ${excludes} -zcvf ${tempSource}/zip.tgz -C ${tempSource} package`)
  execSync(`rm -rf ${tempSource}/package`)
  
  console.log(`Packaged ${project.name}`)
}
