/* eslint-disable indent */

const generateDefault = require('./fields/generateDefault')
const generateImage = require('./fields/generateImage')
const generateImageCrop = require('./fields/generateImageCrop')
const generateRepeater = require('./fields/generateRepeater')

const generateTemplates = (customPostTypes, fieldGroups) =>
  fieldGroups.reduce((prev, current) => [ ...prev, ...current.fields ], []).map(field =>
    ({
      fileName: field.connectorName,
      template: (() => {
        switch (field.type) {
          case 'repeater':
            return generateRepeater(field)
          case 'file':
          case 'image':
            return generateImage(field)
          case 'image_crop':
            return generateImageCrop(field)
          default:
            return generateDefault(field)
        }
      })()
    })
  )

module.exports.generateTemplate = generateTemplates
