#!/usr/bin/env node
const path = require('path')

const generateSchema = require('../generate/index')
require.context = require('../generate/requireContextPolyfill')

async function go () {
  // await RouteCodeGenerator.findRoutes()
  // await RouteCodeGenerator.generateRoutesFile()
  // await generateLangCode()
  // console.log('test')

  // Recipe
  // 1. Locate all test directories with acf-exports folder
  // 2. For each of these test directores, Run generateSchema with those exports inside of that directory
  /**
   * Get a list of our schema generation template files, using a require.context polyfill
   */
  const testAcfExports = require.context(path.join(__dirname, '..'), true, /test\/.*acf-exports/)

  const uniqueAcfExportDirectories = Object.keys(testAcfExports).reduce((accum, current) => {
    const dirName = path.dirname(current)
    return accum.filter(a => a !== dirName).concat(dirName)
  }, [])
}

go()
