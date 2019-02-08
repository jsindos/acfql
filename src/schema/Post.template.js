/* eslint-disable indent */

module.exports.generateTemplate = () => `\
const Image = require('./Image')

const Post = \`
  type Post {
    ID: Int
    postTitle: String
    postContent: String
    customFields: JSON
    featuredImage: Image
    postName: String
    guid: String
    postExcerpt: String
    postType: String
  }
\`

module.exports = () => [Post, Image]
`
