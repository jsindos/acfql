const util = require('util')
const exec = util.promisify(require('child_process').exec)

/**
 * Delete all pre-existing ACF fields when importing through `wp acf clean`
 */
const cleanAcf = async () => {
  try {
    const { stdout, stderr } = await exec('cd ../testpress && wp acf clean')
    console.log('stdout:', stdout)
    console.log('stderr:', stderr)
  } catch (e) {
    // The command failed
    console.log(e)
  }
}
