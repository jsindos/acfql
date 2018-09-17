const util = require('util')
const exec = util.promisify(require('child_process').exec)

/**
 * Delete all pre-existing ACF fields when importing through `wp acf clean`
 */
const cleanAcf = async (absolutePathToProject) => {
  try {
    const { stdout, stderr } = await exec(`cd ${absolutePathToProject} && wp acf clean`)
    console.log(stdout)
    console.log(stderr)
  } catch (e) {
    // The command failed
    console.log(e)
  }
}

module.exports = cleanAcf
