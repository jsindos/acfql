const mkdirp = require('mkdirp')
const getDirName = require('path').dirname
const fs = require('fs')

function camelize (str, fullCase = false) {
  return str.replace(/_/g, ' ').replace(/,/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
    return index === 0 && !fullCase ? letter.toLowerCase() : letter.toUpperCase()
  }).replace(/\s+/g, '')
}

function concatenateArrayInObjectInArray (array, action) {
  const [ key, value ] = action.find
  return array.map((item) => {
    if (item[key] !== value) {
      // This isn't the item we care about - keep it as-is
      return item
    }

    // Otherwise, this is the one we want - return an updated value
    return {
      ...item,
      [ action.updateKey ]: [ ...item[action.updateKey], ...action.update ]
    }
  })
}

function updateObjectInArray (array, action) {
  const [ key, value ] = action.find
  return array.map((item) => {
    if (item[key] !== value) {
      // This isn't the item we care about - keep it as-is
      return item
    }

    // Otherwise, this is the one we want - return new value
    return {
      ...item,
      [action.updateKey]: action.update
    }
  })
}

function writeFile (path, contents, cb) {
  mkdirp(getDirName(path), function (err) {
    if (err) return cb(err)
    fs.writeFile(path, contents, cb)
  })
}

module.exports.camelize = camelize
module.exports.concatenateArrayInObjectInArray = concatenateArrayInObjectInArray
module.exports.updateObjectInArray = updateObjectInArray
module.exports.writeFile = writeFile
