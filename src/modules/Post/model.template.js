module.exports.generateTemplate = () =>
`const Sequelize = require('sequelize')

module.exports = function (Conn, prefix) {
  return Conn.define(prefix + 'posts', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    post_author: { type: Sequelize.INTEGER },
    post_title: { type: Sequelize.STRING },
    post_content: { type: Sequelize.STRING },
    post_excerpt: { type: Sequelize.STRING },
    post_status: { type: Sequelize.STRING },
    post_type: { type: Sequelize.STRING },
    post_name: { type: Sequelize.STRING},
    post_date: { type: Sequelize.STRING},
    post_parent: { type: Sequelize.INTEGER},
    menu_order: { type: Sequelize.INTEGER},
    guid: { type: Sequelize.STRING}
  })
}
`
