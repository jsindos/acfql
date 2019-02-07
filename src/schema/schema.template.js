/* eslint-disable indent */

module.exports.generateTemplate = (customPostTypes, fieldGroups) => `\
${customPostTypes.map(c =>
`const ${c.fullCaseName} = require('./customPostTypes/${c.fullCaseName}')
`
).join('')}
const Post = require('./Post')

const RootQuery = \`
  scalar JSON

  type Query {
    ${customPostTypes.map(c =>
    `${c.pluralizedName}(language: String): [${c.fullCaseName}]
    ${c.camelizedName}(name: String, id: Int): ${c.fullCaseName}
    `
    ).join('')}
    post(name: String, id: Int, postType: String): Post
    posts(category: String, postType: String, language: String): [Post]
  }
\`

const SchemaDefinition = \`
  schema {
    query: Query
  }
\`

module.exports = [
  ${customPostTypes.map(c =>
  `${c.fullCaseName},
  `
  ).join('')}
  Post,
  RootQuery,
  SchemaDefinition
]
`
