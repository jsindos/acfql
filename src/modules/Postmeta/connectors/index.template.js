module.exports.generateTemplate = () =>
`const getPostmeta = require('./getPostmeta')

module.exports = function ({ Postmeta }) {
  return {
    getPostmeta: getPostmeta(Postmeta)
  }
}
`
