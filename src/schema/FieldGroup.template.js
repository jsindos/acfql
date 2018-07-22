const generateTemplates = (customPostTypes, fieldGroups) => {
  return fieldGroups.map(fieldGroup => {
    return {
      fileName: fieldGroup.fullCaseName,
      template: `const ${fieldGroup.fullCaseName} = \`

type ${fieldGroup.fullCaseName} {
  ${fieldGroup.fields.map(f =>
  `
  ${f.fullName}: JSON`).join('')}
}
\`

module.exports = () => [ ${fieldGroup.fullCaseName} ]

`
    }
  })
}
  
module.exports.generateTemplate = generateTemplates
  