#!/usr/bin/env node
const path = require('path')

const generateSchema = require('../generate/index')
require.context = require('../generate/requireContextPolyfill')

async function go () {
  /**
   * Get a list of our test acf export files, using a require.context polyfill
   */
  const testAcfExports = require.context(path.join(__dirname, '..'), true, /test\/.*acf-exports/)

  const uniqueAcfExportDirectories = Object.keys(testAcfExports).reduce((accum, current) => {
    const dirName = path.dirname(current)
    return accum.filter(a => a !== dirName).concat(dirName)
  }, [])

  /**
   * Run `generateSchema` in each test directory containing acf-exports directory
   */
  await Promise.all(uniqueAcfExportDirectories.map(async acfExportDirectory => {
    const testDirectory = path.dirname(acfExportDirectory)
    await generateSchema(`${testDirectory}/graphql`, acfExportDirectory)
  }))
}

go()
