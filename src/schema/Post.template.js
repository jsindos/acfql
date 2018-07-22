module.exports.generateTemplate = () =>
`const Post = \`
  type Post {
    id: Int
    post_title: String
    post_content: String
    customFields: JSON
  }
\`

module.exports = () => [Post]
`