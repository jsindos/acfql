export default function (Post, Postmeta) {
  return function (postId) {
    return Postmeta.findOne({
      where: {
        post_id: postId,
        meta_key: 'wp_theatre_prod'
      }
    }).then(postMeta => {
      if (postMeta) {
        const { meta_value } = postMeta.dataValues
        return Post.findOne({
          where: {
            id: Number(meta_value)
          }
        }).then(parentPost => {
          if (parentPost) {
            return parentPost
          }
        })
      }
      return null
    })
  }
}