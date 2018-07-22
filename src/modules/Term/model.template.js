module.exports.generateTemplate = () =>
`const Sequelize = require('sequelize')

const TermModel = (Conn, prefix) => {
  return Conn.define(prefix + 'terms', {
    term_id: { type: Sequelize.INTEGER, primaryKey: true },
    name: { type: Sequelize.STRING },
    slug: { type: Sequelize.STRING },
    term_group: { type: Sequelize.INTEGER },
  })
}

const TermRelationshipModel = (Conn, prefix) => {
  return Conn.define(prefix + 'term_relationships', {
    object_id: { type: Sequelize.INTEGER, primaryKey: true },
    term_taxonomy_id: { type: Sequelize.INTEGER },
    term_order: { type: Sequelize.INTEGER },
  })
}

module.exports = { TermModel, TermRelationshipModel }
`
