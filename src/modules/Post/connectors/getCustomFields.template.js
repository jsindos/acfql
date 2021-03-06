/* eslint-disable indent */

const camelize = require('../../../../generate/utility').camelize

module.exports.generateTemplate = (customPostTypes, fieldGroups) =>
`const customFieldConnectors = require('../../CustomFields/connectors/index')
const camelize = require('../../../utility').camelize

const updateObjectInObject = (object, key, update) => {
  return Object.entries(object).map(([ k, item ]) => {
    if (k !== key) {
      // This isn't the item we care about - keep it as-is
      return {
        [k]: item
      }
    }

    // Otherwise, this is the one we want - return an updated value
    return {
      [k]: {
        ...item,
        ...update
      }
    }
  }).reduce((a, c) => ({ ...a, ...c }), {})
}

module.exports = function (Post, Postmeta) {
  /**
   * fieldNames is written alphabetically from the list of fieldGroups
   * 
   * \`Connectors\` is written in the same order
   * 
   * So renamedConnectors is formed through mapping over Connectors, and using the map index to access
   * the associated name from fieldNames
   */
  const Connectors = customFieldConnectors({ Post, Postmeta })  
  const groupedFieldNames = ${JSON.stringify(fieldGroups.map(fieldGroup => ({ [camelize(fieldGroup.fullCaseName)]: fieldGroup.fields.map(f => f.fullName) })).reduce((a, c) => ({ ...a, ...c }), {}))}
  const fieldNames = [ '${fieldGroups.reduce((prev, current) =>
    [ ...prev, ...current.fields.map(f => ({ ...f, fullName: camelize(`${current.fullCaseName} ${f.fullName}`) })) ], [])
    .map(f => f.fullName).join('\', \'')}' ]
  const renamedConnectors = Object.values(Connectors)
    .map((a, i) => ({ [fieldNames[i]]: a })).reduce((a, c) => ({ ...a, ...c }), {})
  return function ({ postId }) {
    // Retrieve fields using connectors
    return Promise.all(Object.entries(renamedConnectors)
      .map(
        ([ fieldName, connectorFn ]) => connectorFn({ postId }).then(value => ({ [fieldName]: value }))
      )
    // Place retrieved fields under associated field group
    ).then(values => values.reduce((a, c) => {
      const [ currentField, currentValue ] = Object.entries(c)[0]
      const [ fieldGroup, _ ] = Object.entries(groupedFieldNames)
        .find(([ fieldGroup, fields ]) => fields.find(field => camelize(\`\${fieldGroup} \${field}\`) === currentField))
      return updateObjectInObject(
        a,
        fieldGroup,
        {
          [camelize(currentField.replace(fieldGroup, ''))]: currentValue
        }
      )
    }, ${JSON.stringify(fieldGroups.map(fieldGroup => ({ [camelize(fieldGroup.fullCaseName)]: {} })).reduce((a, c) => ({ ...a, ...c }), {}))}))
  }
}
`
