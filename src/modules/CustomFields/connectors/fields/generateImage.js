/* eslint-disable indent */

module.exports = (field) => `\
module.exports = (Post, Postmeta, settings) => {
  return function ({ postId, additionalFields }) {
    if (settings && settings.privateSettings.languageEnabled) {
      if (additionalFields.lang.selectedLanguage !== settings.privateSettings.defaultLanguage) {
        // Get the image from the default language post
        postId = additionalFields.lang.otherLanguageIds[settings.privateSettings.defaultLanguage]
      }
    }
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
