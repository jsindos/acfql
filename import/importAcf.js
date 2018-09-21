const fs = require('fs')
const path = require('path')
const util = require('util')

const exec = util.promisify(require('child_process').exec)

/**
 * Import all ACF field groups in one run of this script
 */
const importAcf = async (absolutePathToProject, DIR) => {
  return Promise.all(fs.readdirSync(DIR).map(async file => {
    const pathToFile = path.join(process.cwd(), DIR, file)
    try {
      console.log(`Importing ${file}.\n`)
      const { stdout, stderr } = await exec(`cd ${absolutePathToProject} && \
      wp acf import --json_file=${pathToFile}`)
      await stdout && console.log(stdout)
      await stderr && console.log(stderr)
    } catch (e) {
      // The command failed
      console.log(e)
      process.exit()
    }
  }))
}

module.exports = importAcf
