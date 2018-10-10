/* eslint-disable indent */

module.exports = (field) => `\
const getField = require('./utility/getField')

module.exports = (Post, Postmeta) => {
  return function ({ postId }) {
    return Post.findOne(getField('${field.fieldName}')).then(post => {
      if (!post) return null
      return Postmeta.findOne({
        where: {
          meta_value: post.post_name
        }
      }).then(postMeta => {
        if (!postMeta) return null
        return Postmeta.findOne({
          where: {
            meta_key: postMeta.meta_key.substring(1),
            post_id: postId
          }
        })
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
    })
  }
}
`
