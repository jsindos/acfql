/* eslint-disable indent */

module.exports.generateTemplate = () => `\
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const camelizeObjectKeys = require('../../../utility').camelizeObjectKeys

module.exports = function (Post) {
  return function ({ name, id: postId, postType }) {
    let where = {
      post_status: 'publish',
      [Op.or]: [{ id: postId }, { post_name: name }],
    }

    if (postType) {
      where = { ...where, post_type: postType }
    }

    return Post.findOne({
      where: where,
    }).then(post => camelizeObjectKeys(post))
  }
}
`
