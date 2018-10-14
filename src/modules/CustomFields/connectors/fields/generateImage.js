/* eslint-disable indent */

module.exports = (field) => `\
const getField = require('./utility/getField')

module.exports = (Post, Postmeta) => {
  return function ({ postId }) {
    return Postmeta.findOne({
      where: {
        meta_key: '${field.fieldName}',
        post_id: postId
      }
    }).then(postMeta => {
      if (!postMeta) return null
      return Post.findOne({
        where: {
          id: Number(postMeta.meta_value)
        }
      }).then(post => {
        return post && post.guid
      })
    })
  }
}
`
