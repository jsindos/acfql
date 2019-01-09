/* eslint-disable indent */

module.exports.generateTemplate = () => `\
module.exports = function (Post, Postmeta) {
  return function ({ postId }) {
    return Postmeta.findOne({
      where: {
        post_id: postId,
        meta_key: '_thumbnail_id'
      }
    }).then(res => {
      if (res) {
        return Post.findOne({
          where: {
            ID: Number(res.meta_value)
          }
        }).then(post => {
          return post.guid
        })
      }
      return null
    })
  }
}
`
