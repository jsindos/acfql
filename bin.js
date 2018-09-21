#!/usr/bin/env node

const importAcf = require('./import')
const buildSchema = require('./generate')
const server = require('./server')

let isImportAcf = false
let isBuildSchema = false
let isServer = false

process.argv.slice(2).filter(function (arg) {
  if (arg.includes('import')) {
    isImportAcf = true
  } else if (arg.includes('build-schema')) {
    isBuildSchema = true
  } else if (arg.includes('server')) {
    isServer = true
  }
})

async function go () {
  console.log(process.env.PWD)
  if (isImportAcf) {
    importAcf()
  } else if (isBuildSchema) {
    buildSchema()
  } else if (isServer) {
    server()
  } else {
    console.log('Usage: acfql <import|build-schema|server>')
    console.log('')
    console.log('  Runs an acfql command.')
    console.log('')
    console.log('Options:')
    console.log('')
    console.log('  import       Run acf import')
    console.log('  build-schema Build acfql schema')
    console.log('  server       Runs the graphql server')
    process.exit()
  }
}

go()
