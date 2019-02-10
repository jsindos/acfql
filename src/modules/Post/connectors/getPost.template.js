/* eslint-disable indent */

module.exports.generateTemplate = () => `\
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const camelizeObjectKeys = require('../../../utility').camelizeObjectKeys

module.exports = function (Post, TermTaxonomy, settings) {
  return async function ({ name, id: postId, postType }) {
    let where = {
      post_status: 'publish',
      [Op.or]: [{ ID: postId }, { post_name: name }],
    }

    if (postType) {
      where = { ...where, post_type: postType }
    }

    if (settings && settings.privateSettings.languageEnabled) {
      const allLanguages = []
      const post = await Post.findOne({
        where: where,
      })
      if (!post) return null
      const termTaxonomy = await TermTaxonomy.findOne({
        where: {
          description: {
            [Op.like]: \`%";i:\${post.ID}%\`
          },
          taxonomy: 'post_translations'
        }
      })
      const selectedLanguage = termTaxonomy.description.match(new RegExp(String.raw\`"([A-Za-z]+)";i:\${post.ID}\`))[1]
      let matches
      const regex = /"([A-Za-z]+)"/g
      while (matches = regex.exec(termTaxonomy.description)) {
        allLanguages.push(matches[1])
      }
      const otherLanguageIds = allLanguages
        .filter(l => l !== selectedLanguage)
        .reduce((accum, l) => {
          // Some posts don't have all languages
          const match = termTaxonomy.description.match(new RegExp(String.raw\`"\${l}";i:(\\d+)\`))
          return match ? { ...accum, [l]: match[1] } : accum
        }, {})

      const additionalFields = {
        lang: {
          selectedLanguage,
          otherLanguageIds
        }
      }

      // Differences between a testing environment and production environment with sequelize
      if (post.dataValues) {
        post.dataValues.additionalFields = additionalFields
      } else {
        post.additionalFields = additionalFields
      }

      return camelizeObjectKeys(post)
    }

    return Post.findOne({
      where: where,
    }).then(post => post && camelizeObjectKeys(post))
  }
}
`
