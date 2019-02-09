/* eslint-disable indent */

function generateTemplate (customPostTypes, fieldGroups) {
  return `${fieldGroups.map(g =>
`// ${g.fullCaseName} fields
${g.fields.map(f =>
`const ${f.connectorName} = require('./${f.connectorName}')
`).join('')}
`
).join('')}
function Connectors ({ Post, Postmeta }, settings) {
  return {
    ${fieldGroups.map(g =>
    g.fields.map(f =>
    `
    ${f.connectorName}: ${f.connectorName}(Post, Postmeta, settings)`
    )
    )}
  }
}

module.exports = Connectors
`
}

module.exports.generateTemplate = generateTemplate
