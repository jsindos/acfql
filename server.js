const express = require('express')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')

if (!fs.existsSync('./settings.js')) {
  console.log('Please create settings.js by copying settings.example.js. Fill out the relevant database details.')
  process.exit()
}

const { executableSchema } = require('./schema')

const SERVER_PORT = 3001

const server = express()
server.use(cors())

server.use('/graphql', bodyParser.json(), graphqlExpress((req) => {
  return {
    schema: executableSchema
  }
}))

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}))

server.listen(SERVER_PORT, () => {
  console.log(`App is now running on http://localhost:${SERVER_PORT}`)
})
