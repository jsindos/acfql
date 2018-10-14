const fs = require('fs')
const path = require('path')

const ACFStore = require('../generate/acfstore')
const camelize = require('../generate/utility').camelize

const main = async () => {
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

  const schemaRepresentation = store.fieldGroups.map(g => ({
    [camelize(g.fullCaseName)]: g.fields.reduce((acc, field) => ({
      [field.fullName]: field.type === 'repeater' ? [] : '',
      ...acc
    }), {})
  }))

  console.log(JSON.stringify(schemaRepresentation.reduce((a, c) => ({ ...a, ...c }), {}), null, 2))

  // console.log(JSON.stringify(store.fieldGroups, null, 2))
  process.exit()
}

module.exports = main
