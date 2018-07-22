module.exports.generateTemplate = () =>
`module.exports.Database = require('./db')
module.exports.Resolvers = require('./resolvers')
module.exports.Definitions = require('./schema/schema')
`
