/* eslint-disable indent */

module.exports.generateTemplate = () =>
`const Post = \`
  type Post {
    ID: Int
    postTitle: String
    postContent: String
    customFields: JSON
    featuredImage: String
    postName: String
    guid: String
    postExcerpt: String
  }
\`

module.exports = () => [Post]
`
