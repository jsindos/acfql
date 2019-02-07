/* eslint-disable indent */

module.exports.generateTemplate = (customPostTypes, fieldGroups) => {
  return customPostTypes.map(customPostType => {
    return {
      fileName: customPostType.fullCaseName,
      template: `\
${customPostType.fieldGroups.map(g =>
`const ${g.charAt(0).toUpperCase() + g.slice(1)} = require('../fieldGroups/${g.charAt(0).toUpperCase() + g.slice(1)}')
`
      ).join('')}

const ${customPostType.fullCaseName} = \`
type ${customPostType.fullCaseName} {
  ID: Int
  postTitle: String
  postType: String
  ${customPostType.fieldGroups.map(g =>
  `
  ${g}: ${g.charAt(0).toUpperCase() + g.slice(1)}`
  )}
}
\`

module.exports = () => [ ${customPostType.fullCaseName}, ${customPostType.fieldGroups
  .map((g, i) => `${g.charAt(0).toUpperCase() + g.slice(1)}${i !== (customPostType.fieldGroups.length - 1) ? ', ' : ''}`).join('')} ]
`
    }
  })
}
