const fs = require('fs')
const path = require('path')
const util = require('util')

const ACFStore = require('./acfstore')
const writeFile = require('./utility').writeFile
require.context = require('./requireContextPolyfill')

const exec = util.promisify(require('child_process').exec)

const main = async (buildDirectory = './graphql', acfExportsDirectory = './acf-exports', single = true) => {
  try {
    const { stdout, stderr } = await exec(`npx rimraf ${buildDirectory}`)
    stdout && console.log(stdout)
    stderr && console.log(stderr)
  } catch (e) {
    // The command failed
    console.log(e)
    process.exit()
  }
  /**
   * Get a list of our schema generation template files, using a require.context polyfill
   */
  const templates = require.context(path.join(__dirname, '..'), true, /(?!.*node_modules).*\.template\.js$/)

  /**
   * Create the ACFStore that will store the information from our ACF JSON exports
   */
  const store = new ACFStore()

  if (!fs.existsSync(path.join(process.cwd(), acfExportsDirectory))) {
    console.log('Please export your WordPress ACF fields to ./acf-exports using the advanced-custom-fields-wpcli tool (https://github.com/hoppinger/advanced-custom-fields-wpcli).')
    process.exit()
  }

  /**
   * Parse the ACF JSON exports into the ACFStore
   */
  store.parse(acfExportsDirectory)

  // console.log(JSON.stringify(store.fieldGroups, null, 2))

  /**
   * For each schema generation template file,
   * generate the template using the customPostTypes and fieldGroups found in the ACF JSON exports
   *
   * Builds `buildDirectory` directory, `./graphql` by default
   */
  await Promise.all(Object.entries(templates).map(async ([ templatePath, { generateTemplate } ]) => {
    const template = generateTemplate(store.customPostTypes, store.fieldGroups)
    if (Array.isArray(template)) {
      template.map(async t => {
        const fileName = path.join(path.dirname(templatePath), `${t.fileName}.js`).replace(/src/, buildDirectory)
        await writeFile(fileName, t.template, (err) => err && console.log(err))
      })
    } else {
      const fileName = templatePath.replace(/.template/, '').replace(/src/, buildDirectory)
      await writeFile(fileName, template, (err) => err && console.log(err))
    }
  }))

  console.log(`Your graphql schema has been generated in "${buildDirectory}".`)
  single && process.exit()
}

module.exports = main
