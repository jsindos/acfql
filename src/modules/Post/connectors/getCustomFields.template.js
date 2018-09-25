/* eslint-disable indent */

module.exports.generateTemplate = (customPostTypes, fieldGroups) =>
`const customFieldConnectors = require('../../CustomFields/connectors/index')

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
  const fieldNames = [ '${fieldGroups.reduce((prev, current) => [ ...prev, ...current.fields ], []).map(f => f.fullName).join('\', \'')}' ]
  const renamedConnectors = Object.values(Connectors)
    .map((a, i) => ({ [fieldNames[i]]: a })).reduce((a, c) => ({ ...a, ...c }), {})
  return function ({ postId }) {
    return Promise.all(Object.entries(renamedConnectors)
      .map(
        ([ fieldName, connectorFn ]) => connectorFn({ postId }).then(value => ({ [fieldName]: value }))
      )
    ).then(values => values.reduce((a, c) => ({ ...a, ...c }), {}))
  }
}
`
