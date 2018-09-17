/**
 * This script is used to help streamline the acf import process
 *
 * Specifically, the script helps to:
 * 1. Delete all pre-existing ACF fields when importing through `wp acf clean`
 * 2. Import all ACF field groups in one run of this script
 * 3. Confirm Ids of pages or posts found in acf-exports
 *     - This is assisted through acfstore.js
 */

const fs = require('fs')
const path = require('path')

const captureArgumentWithMessage = require('./utility').captureArgumentWithMessage

/**
 * The directory containing our ACF JSON exports
 */
const DIR = './acf-exports'

if (!fs.existsSync(path.join(__dirname, '..', DIR))) {
  console.log('Please export your WordPress ACF fields to ./acf-exports using the advanced-custom-fields-wpcli tool before using the import tool (https://github.com/hoppinger/advanced-custom-fields-wpcli).')
  process.exit()
}

console.log('Welcome to the import tool.\n')
console.log(`Please be aware this tool deletes pre-existing ACF fields from your WordPress installation, \
and imports those found in /acf-exports.\n`)

/**
 * main function
 * It is run as async as each step must wait for user input
 */
const main = async () => {
  const absolutePath = await captureArgumentWithMessage(
    `Please enter the absolute path to your WordPress project.\n`
  )
  // await cleanAcf(absolutePath)
  // await confirmIds()
  // await importAcf()
}

main()
