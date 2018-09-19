#!/usr/bin/env node

/**
 * This script is used to streamline the acf import process
 *
 * Specifically, the script:
 * 1. Deletes all pre-existing ACF fields using `wp acf clean`
 * 2. Imports all ACF field groups in one run of the script
 * 3. Confirms ids of pages or posts found in acf-exports
 *     - This is assisted through ../generate/acfstore.js
 */

const fs = require('fs')
const path = require('path')

const captureArgumentWithMessage = require('./utility').captureArgumentWithMessage
const cleanAcf = require('./cleanAcf')
const confirmIds = require('./confirmIds')
const importAcf = require('./importAcf')

/**
 * The directory containing the ACF JSON exports
 */
const DIR = './acf-exports'

if (!fs.existsSync(path.join(__dirname, '..', DIR))) {
  console.log('Please export your WordPress ACF fields to ./acf-exports using the advanced-custom-fields-wpcli tool before using the import tool (https://github.com/hoppinger/advanced-custom-fields-wpcli).')
  process.exit()
}

console.log('Welcome to the import tool.\n')
console.log(`\x1b[1mPlease be aware this tool deletes pre-existing ACF fields from your WordPress installation, \
and imports those found in /acf-exports.\x1b[0m\n`)

/**
 * main function
 * It is run as async as each step must wait for user input
 */
const main = async () => {
  const absolutePathToProject = await captureArgumentWithMessage(
    `\x1b[1m\x1b[41m\x1b[37mPlease enter the absolute path to your WordPress project.\x1b[0m\n`
  )
  await cleanAcf(absolutePathToProject)
  await confirmIds(DIR)
  await importAcf(absolutePathToProject, DIR)
  process.exit()
}

main()
