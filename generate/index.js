#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const util = require('util')

const ACFStore = require('./acfstore')
const writeFile = require('./utility').writeFile
require.context = require('./requireContextPolyfill')

const exec = util.promisify(require('child_process').exec)

const main = async () => {
  try {
    const { stdout, stderr } = await exec(`npx rimraf graphql`)
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

  /**
   * The directory containing our ACF JSON exports
   */
  const DIR = './acf-exports'

  if (!fs.existsSync(path.join(process.cwd(), DIR))) {
    console.log('Please export your WordPress ACF fields to ./acf-exports using the advanced-custom-fields-wpcli tool (https://github.com/hoppinger/advanced-custom-fields-wpcli).')
    process.exit()
  }

  /**
   * Parse the ACF JSON exports into the ACFStore
   */
  store.parse(DIR)

  // console.log(JSON.stringify(store.fieldGroups, null, 2))

  /**
   * For each schema generation template file,
   * generate the template using the customPostTypes and fieldGroups found in the ACF JSON exports
   *
   * Builds to the '/graphql' directory in the root of the project
   */
  await Promise.all(Object.entries(templates).map(async ([ templatePath, { generateTemplate } ]) => {
    const template = generateTemplate(store.customPostTypes, store.fieldGroups)
    if (Array.isArray(template)) {
      template.map(async t => {
        const fileName = path.join(path.dirname(templatePath), `${t.fileName}.js`).replace(/src/, 'graphql')
        await writeFile(fileName, t.template, (err) => err && console.log(err))
      })
    } else {
      const fileName = templatePath.replace(/.template/, '').replace(/src/, 'graphql')
      await writeFile(fileName, template, (err) => err && console.log(err))
    }
  }))

  console.log('Your graphql schema has been generated in "./graphql".')
  process.exit()
}

module.exports = main
