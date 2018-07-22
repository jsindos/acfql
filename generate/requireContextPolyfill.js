const fs = require('fs')
const path = require('path')

/**
 * require.context polyfill for server side
 * https://github.com/catamphetamine/webpack-isomorphic-tools/issues/48#issuecomment-182878437
 *
 * @param {*} base
 * @param {*} scanSubdirectories
 * @param {*} regularExpression
 */
module.exports = function (base, scanSubdirectories, regularExpression) {
  const contents = {}

  function readDirectory (directory) {
    for (let child of fs.readdirSync(directory)) {
      const fullPath = path.join(directory, child)
      if (fs.statSync(fullPath).isDirectory()) {
        if (scanSubdirectories) {
          readDirectory(fullPath)
        }
      } else {
        if (regularExpression && !fullPath.match(regularExpression)) {
          continue
        }
        contents[path.relative(base, fullPath)] = require(fullPath) // require(fullPath)
      }
    }
  }

  readDirectory(base)
  return contents
}
