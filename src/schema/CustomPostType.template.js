const generateTemplates = (customPostTypes, fieldGroups) => {
  return customPostTypes.map(customPostType => {
    return {
      fileName: customPostType.fullCaseName,
      template: `${customPostType.fieldGroups.map(g =>
`const ${g.charAt(0).toUpperCase() + g.slice(1)} = require('./${g.charAt(0).toUpperCase() + g.slice(1)}')
`
).join('')}

const ${customPostType.fullCaseName} = \`
type ${customPostType.fullCaseName} {
  id: Int
  post_title: String
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

module.exports.generateTemplate = generateTemplates
