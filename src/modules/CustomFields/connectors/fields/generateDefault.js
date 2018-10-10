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
    }).then(postMeta => postMeta && postMeta.meta_value)
  }
}
`
