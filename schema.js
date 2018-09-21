const { privateSettings, publicSettings } = require(`${process.cwd()}/settings`)
const { Definitions, Database: ACFDatabase, Resolvers: ACFResolvers } = require(`${process.cwd()}/graphql`)
const { makeExecutableSchema } = require('graphql-tools')
const GraphQLJSON = require('graphql-type-json')

// returns ACFDatabase object that has provides connectors to the database
const Database = new ACFDatabase({ privateSettings, publicSettings })
const Connectors = Database.connectors

// Resolving functions that use the database connections to resolve GraphQL queries
const Resolvers = ACFResolvers(Connectors, publicSettings)

const executableSchema = makeExecutableSchema({
  // GraphQL schema definitions
  typeDefs: Definitions,
  resolvers: {
    ...Resolvers,
    JSON: GraphQLJSON
  }
})

module.exports.Connectors = Connectors
module.exports.Resolvers = Resolvers
module.exports.Definitions = Definitions
module.exports.executableSchema = executableSchema
