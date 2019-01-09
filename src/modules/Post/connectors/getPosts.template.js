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
        let languagePosts = []
        return posts.reduce((promise, post) => {
          return promise
            .then(result => {
              return TermTaxonomy.findOne({
                where: {
                  description: {
                    [Op.like]: \`%"$\{language || 'en'}";i:$\{post.ID}%\`
                  },
                  taxonomy: 'post_translations'
                }
              })
            }).then(result =>
              result &&
              languagePosts.push(post))
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
