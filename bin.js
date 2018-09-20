#!/usr/bin/env node

const importAcf = require('./import')
const buildSchema = require('./generate')

let isImportAcf = false
let isBuildSchema = false

process.argv.slice(2).filter(function (arg) {
  if (arg.includes('import')) {
    isImportAcf = true
  } else if (arg.includes('build-schema')) {
    isBuildSchema = true
  }
})

function go () {
  if (isImportAcf) {
    importAcf()
  } else if (isBuildSchema) {
    buildSchema()
  } else {
    console.log('Usage: acfql <import|build-schema>')
    console.log('')
    console.log('  Runs an acfql command.')
    console.log('')
    console.log('Options:')
    console.log('')
    console.log('  import       Run acf import')
    console.log('  build-schema Build acfql schema')
    process.exit()
  }
}

go()
