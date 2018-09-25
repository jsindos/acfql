const Sequelize = require('sequelize')
const Op = Sequelize.Op

/**
 * Map query handlers for a mock to a sampleData
 * @param {*} mock
 * @param {*} sampleData - JSON representation of SQL data from Sequel Pro
 */
const applyHandlers = (mock, sampleData) =>
  mock.$queryInterface.$useHandler((query, queryOptions, done) => {
    if (query === 'findOne') {
      return sampleData.data.find(s =>
        Object.entries(queryOptions[0].where).map(([ key, value ]) => applyWhereOperation(s[key], value)).every(v => v)
      ) || null
    }
    if (query === 'findAll') {
      return sampleData.data.filter(s =>
        Object.entries(queryOptions[0].where).map(([ key, value ]) => applyWhereOperation(s[key], value)).every(v => v)
      ) || null
    }
  })

/**
 * Apply a where operation found inside of a query
 * @param {*} fieldValue - The value of the field on which the where clause is being applied
 * @param {*} where - The value of the where clause
 * Post.findAll({
 *   where: {
 *     post_status: 'publish', // post_status is `fieldValue`, 'publish' is `where`
 *     post_type: {
 *       [Op.in]: [ 'wp_apple' ]
 *     }
 *   }
 * })
 */
const applyWhereOperation = (fieldValue, where) => {
  if (where[Op.in]) {
    return where[Op.in].includes(fieldValue)
  }
  if (where[Op.like]) {
    // Replace one `%` on either side of Op.like with empty string
    return fieldValue.includes(where[Op.like].replace(/^%|%+$/gm, ''))
  }
  return fieldValue === where
}

module.exports.applyHandlers = applyHandlers
