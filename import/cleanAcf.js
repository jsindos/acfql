const util = require('util')

const exec = util.promisify(require('child_process').exec)

/**
 * Delete all pre-existing ACF fields when importing through `wp acf clean`
 */
const cleanAcf = async (absolutePathToProject) => {
  console.log()
  try {
    const { stdout, stderr } = await exec(`cd ${absolutePathToProject} && wp acf clean`)
    stdout && console.log(stdout)
    stderr && console.log(stderr)
  } catch (e) {
    // The command failed
    console.log(e)
    process.exit()
  }
}

module.exports = cleanAcf
