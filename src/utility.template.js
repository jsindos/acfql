/* eslint-disable indent */

module.exports.generateTemplate = () =>
`\
function camelize (str, fullCase = false) {
  return str.replace(/_/g, ' ').replace(/,/g, ' ').replace(/(?:^\\w|[A-Z]|\\b\\w)/g, function (letter, index) {
    return index === 0 && !fullCase ? letter.toLowerCase() : letter.toUpperCase()
  }).replace(/\\s+/g, '')
}

function camelizeObjectKeys (object) {
  return Object.entries(object.dataValues || object)
    .reduce((acc, [ key, value ]) => ({ ...acc, ...{ [key === 'ID' ? 'ID' : camelize(key)]: value } }), {})
}

module.exports.camelize = camelize
module.exports.camelizeObjectKeys = camelizeObjectKeys
`
