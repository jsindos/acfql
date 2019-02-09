/* eslint-disable indent */

module.exports.generateTemplate = () => `\
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const camelizeObjectKeys = require('../../../utility').camelizeObjectKeys

module.exports = function (Post, Terms, TermRelationships, TermTaxonomy, settings) {
  return function({ postType, category, order, limit = 10, skip = 0, userId, language }) {
    const orderBy = order ? [order.orderBy, order.direction] : ['menu_order', 'ASC']
    const where = {
      post_status: 'publish',
      post_type: {
        [Op.in]: ['post']
      }
    }
    
    if (postType) {
      where.post_type = {
        [Op.in]: [postType]
      }
    }

    if (userId) {
      where.post_author = userId
    }

    if (category) {
      return Post.findAll({
        where: where,
        include: [{
          model: TermRelationships
        }]
      }).then(posts => {
        let categoryPosts = []
        return posts.reduce((promise, post) => {
          return promise
            .then(result => {
              return Terms.findOne({
                where: {
                  term_id: {
                    [Op.in]: post.wp_term_relationships.map(t => t.term_taxonomy_id)
                  },
                  name: category
                }
              })
            }).then(result =>
              result &&
              categoryPosts.push(post)
            )
        }, Promise.resolve())
        .then(() => categoryPosts.map(p => camelizeObjectKeys(p)))
      })
    }

    if (settings && settings.privateSettings.languageEnabled) {
      return Post.findAll({
        where: where
      }).then(posts => {
        const selectedLanguage = language || settings.privateSettings.defaultLanguage
        let languagePosts = []
        let allLanguages = []
        return posts.reduce((promise, post) => {
          return promise
            .then(result => {
              return TermTaxonomy.findOne({
                where: {
                  description: {
                    [Op.like]: \`%"$\{selectedLanguage}";i:$\{post.ID}%\`
                  },
                  taxonomy: 'post_translations'
                }
              })
            }).then(result => {
              if (result) {
                // Parse out all of the languages, only do this once
                if (!allLanguages.length) {
                  let matches
                  const regex = /"([A-Za-z]+)"/g
                  while (matches = regex.exec(result.description)) {
                    allLanguages.push(matches[1])
                  }
                }

                const otherLanguageIds = allLanguages
                  .filter(l => l !== selectedLanguage)
                  .reduce((accum, l) => {
                    // Some posts don't have all languages
                    const match = result.description.match(new RegExp(String.raw\`"\${l}";i:(\\d+)\`))
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
                
                languagePosts.push(post)
              }
            })
        }, Promise.resolve())
          .then(() => languagePosts.map(p => camelizeObjectKeys(p)))
      })
    }

    return Post.findAll({
      where: where,
      // order: [orderBy],
      // limit: limit,
      // offset: skip
    }).then(r => {
      return r.map(p => camelizeObjectKeys(p))
    })
  }
}
`
