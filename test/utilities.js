const Sequelize = require('sequelize')
const Op = Sequelize.Op

/**
 * Map query handlers for a mock to a sampleData
 * @param {*} mock
 * @param {*} sampleData - JSON representation of SQL data from Sequel Pro
 */
const applyHandlers = (mock, sampleData) =>
  mock.$queryInterface.$useHandler((query, queryOptions, done) => {
    const whereClauses = stringifyOps(queryOptions[0].where)
    if (query === 'findOne') {
      return sampleData.data.find(s =>
        Object.entries(whereClauses).map(([ key, value ]) => applyWhereOperation(s, key, value)).every(v => v)
      ) || null
    }
    if (query === 'findAll') {
      return sampleData.data.filter(s =>
        Object.entries(whereClauses).map(([ key, value ]) => applyWhereOperation(s, key, value)).every(v => v)
      ) || null
    }
  })

/**
 * Apply a where operation found inside of a query
 * @param {*} entity - The data entity
 * @param {*} fieldName - The name of the field on which the where clause is being applied
 * @param {*} where - The value of the where clause
 * Note [Op.or] breaks the convention, and in this case fieldName becomes [Op.or]
 * Post.findAll({
 *   where: {
 *     post_status: 'publish', // post_status value of the Post is `fieldValue`, 'publish' is `where`
 *     post_type: {
 *       [Op.in]: [ 'wp_apple' ]
 *     },
 *     [Op.or]: [{ ID: postId }, { post_name: name }],
 *   }
 * })
 */
const applyWhereOperation = (entity, fieldName, where) => {
  if (fieldName === String(Op.or)) {
    const condition = where.some(w => {
      let [ fieldName, whereValue ] = Object.entries(w)[0]
      return entity[fieldName] === whereValue
    })
    return condition
  }
  if (where[Op.in]) {
    return where[Op.in].includes(entity[fieldName])
  }
  if (where[Op.like]) {
    // Replace one `%` on either side of Op.like with empty string
    return entity[fieldName].includes(where[Op.like].replace(/^%|%+$/gm, ''))
  }
  return entity[fieldName] === where
}

module.exports.applyHandlers = applyHandlers

/**
 * For some reason when doing `Object.entries(whereClauses)`, any top-level keys with [Op] keys are not registered in the entries
 * They can still be indexed like whereClause[Op.or], so we index them and stringify them as keys
 * @param {*} whereClause
 */
const stringifyOps = whereClause => {
  const orClause = whereClause[Op.or] && { [String(Op.or)]: whereClause[Op.or] }
  return {
    ...whereClause,
    ...orClause
  }
}
