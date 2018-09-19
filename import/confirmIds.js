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
  await fs.readdirSync(DIR).reduce(async (promise, file) => {
    await promise
    /**
     * If a fieldGroup does not have an associated customPostType, then fieldGroup.resolverFieldGroup will be false
     * This means, for a given JSON export file, the fieldGroup in that file does not have a customPostType in the location,
     * and so is assumed to be tied to a specific page or post ID.
     */
    const fieldGroups = JSON.parse(fs.readFileSync(path.join(__dirname, '..', DIR, file), 'utf8'))
    const ids = await getIds(fieldGroups)
    const updatedJson = fieldGroups.map((j, index) => setId(j, ids[index]))
    return new Promise((resolve, reject) => {
      fs.writeFile(path.join(__dirname, '..', DIR, file), JSON.stringify(updatedJson, null, 4), function (err) {
        if (err) {
          console.log(err)
          process.exit()
        }
        JSON.stringify(updatedJson) !== JSON.stringify(fieldGroups)
          ? console.log(`\n"${file}" was updated with the specified ID.\n`)
          : console.log(`"${file}" was not updated.\n`)
        resolve()
      })
    })
  }, Promise.resolve())
}

/**
 * Gets user input for IDs of pages or posts
 * @param {*} fieldGroups A direct reading of an export file
 * [
 *   {
 *     title: "Orange Information",
 *     location:
 *     [ // locations of first fieldGroup
 *       [
 *         // location 1
 *         // location 2
 *       ]
 *     ]
 *   }
 * ]
 */
const getIds = async (fieldGroups) => {
  const args = await fieldGroups.reduce(async (promise, fieldGroup) => {
    let argument
    const args = await promise
    if (Number.isInteger(Number(fieldGroup.location[0][0].value))) {
      argument = await captureArgumentWithMessage(
        `\x1b[1m\x1b[41m\x1b[37mPlease enter the ID of the page or post associated with the field group "${fieldGroup.title}" \
(Press "enter" to leave unchanged).\x1b[0m\n`
      )
    }
    return Promise.resolve(args.concat([ argument ]))
  }, Promise.resolve([]))
  return args
}

/**
 * Sets the ID in `location` field of the ACF JSON export
 * Assumes only one location field present
 * @param {*} json
 * @param {*} id
 */
const setId = (json, id) => {
  if (id === undefined || !String(id)) return json
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
