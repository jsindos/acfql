/* eslint-disable indent */

module.exports.generateTemplate = () =>
`const Post = \`
  type Post {
    ID: Int
    post_title: String
    post_content: String
    customFields: JSON
  }
\`

module.exports = () => [Post]
`
