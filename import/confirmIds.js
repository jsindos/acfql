const fs = require('fs')
const path = require('path')

const ACFStore = require('../generate/acfstore')

/**
 * Create the ACFStore that will store the information from our ACF JSON exports
 */
const store = new ACFStore()

/**
 * Confirm Ids of pages or posts found in acf-exports
 */
const confirmIds = async (DIR) => {
  /**
   * Parse the ACF JSON exports into our ACFStore
   */
  fs.readdirSync(DIR).forEach(file => {
    const json = JSON.parse(fs.readFileSync(path.join(__dirname, '..', DIR, file), 'utf8'))
    json.forEach(fieldGroup => {
      fieldGroup.location.forEach(location => {
        location.forEach(l => {
          store.addCustomPostType(l.value, l.param)
          store.addFieldGroupRelation(l.value, fieldGroup.title, l.param)
        })
      })
      store.addFieldGroup(fieldGroup.title)
      fieldGroup.fields.forEach(field => {
        store.addField(field.name, fieldGroup.title, field.type)
        if (field.type === 'repeater') {
          field.sub_fields.forEach(subField => {
            store.addFieldSubField(field.name, fieldGroup.title, { subFieldName: subField.name, subFieldType: subField.type })
          })
        }
      })
    })
  })
  // stdin.addListener('data', captureArgument)
}

module.exports = confirmIds
