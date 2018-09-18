const fs = require('fs')
const path = require('path')

const ACFStore = require('../generate/acfstore')
const captureArgumentWithMessage = require('./utility').captureArgumentWithMessage

/**
 * Create the ACFStore that will store the information from our ACF JSON exports
 */
const store = new ACFStore()

/**
 * Confirm Ids of pages or posts found in acf-exports
 */
const confirmIds = async (DIR) => {
  /**
   * Parse the ACF JSON exports into the ACFStore
   */
  fs.readdirSync(DIR).forEach(async file => {
    /**
     * If a fieldGroup does not have an associated customPostType, then fieldGroup.resolverFieldGroup will be false
     * This means, for a given JSON export file, the fieldGroup in that file does not have a customPostType in the location,
     * and so is assumed to be tied to a specific page or post ID.
     */
    const [ json, fieldGroups ] = store.parseFile(file, DIR)
    const ids = await getIds(fieldGroups)
    const updatedJson = json.map((j, index) => setId(j, ids[index]))
    fs.writeFile(path.join(__dirname, '..', DIR, file), JSON.stringify(updatedJson, null, 4), function (err) {
      if (err) {
        return console.log(err)
      }

      console.log('\nThe ACF JSON export was updated with the specified ID.')
    })
  })
}

const getIds = async (fieldGroups) => {
  return Promise.all(fieldGroups.map(async g => {
    if (!g.resolverFieldGroup) {
      return captureArgumentWithMessage(
        `Please enter the ID of the page or post associated with the field group "${g.fullName}"\n`
      )
    }
    return undefined
  }))
}

/**
 * Sets the ID in `location` field of the ACF JSON export
 * Assumes only one location field present
 * @param {*} json
 * @param {*} id
 */
const setId = (json, id) => {
  if (id === undefined) return json
  return {
    ...json,
    ...{
      location: [
        [
          {
            param: json.location[0][0].param,
            operator: '==',
            value: String(id)
          }
        ]
      ]
    }
  }
}

module.exports = confirmIds
