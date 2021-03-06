module.exports.generateTemplate = () =>
`const Sequelize = require('sequelize')

module.exports = function (Conn, prefix) {
  return Conn.define(prefix + 'postmeta', {
    meta_id: { type: Sequelize.INTEGER, primaryKey: true, field: 'meta_id' },
    post_id: { type: Sequelize.INTEGER },
    meta_key: { type: Sequelize.STRING },
    meta_value: { type: Sequelize.INTEGER },
  })
}
`
