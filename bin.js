#!/usr/bin/env node
const exec = require('child_process').exec

const importAcf = require('./import')
const buildSchema = require('./generate')
const generateDefaults = require('./defaults')

let isImportAcf = false
let isBuildSchema = false
let isServer = false
let isDefaults = false

// Copied from rimraf bin.js
process.argv.slice(2).filter(function (arg) {
  if (arg.includes('import')) {
    isImportAcf = true
  } else if (arg.includes('build-schema')) {
    isBuildSchema = true
  } else if (arg.includes('server')) {
    isServer = true
  } else if (arg.includes('defaults')) {
    isDefaults = true
  }
})

async function go () {
  if (isImportAcf) {
    importAcf()
  } else if (isBuildSchema) {
    buildSchema()
  } else if (isServer) {
    // https://stackoverflow.com/questions/38288639/how-to-use-npm-scripts-within-javascript
    const child = exec(`${process.cwd()}/node_modules/.bin/nodemon ${__dirname}/runServer.js --ansi`)
    child.stdout.on('data', function (data) {
      process.stdout.write(data)
    })

    child.stderr.on('data', function (data) {
      process.stdout.write(data)
    })

    child.on('exit', function (data) {
      process.stdout.write('I\'m done!')
    })
  } else if (isDefaults) {
    generateDefaults()
  } else {
    console.log('Usage: acfql <import|build-schema|server|defaults>')
    console.log('')
    console.log('  Runs an acfql command.')
    console.log('')
    console.log('Options:')
    console.log('')
    console.log('  import       Run acf import')
    console.log('  build-schema Build acfql schema')
    console.log('  server       Runs the graphql server')
    console.log('  defaults     Generate defaults for custom fields')
    process.exit()
  }
}

go()
