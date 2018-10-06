/* eslint-disable indent */

const generateTemplates = (customPostTypes, fieldGroups) =>
  fieldGroups.reduce((prev, current) => [ ...prev, ...current.fields ], []).map(field =>
    ({
      fileName: field.connectorName,
      template: (() => {
        switch (field.type) {
          case 'repeater':
            // 1. Need to handle special case for image subfields of a repeater
            // 2. Also not sure if repeater field logic is sound against multiple repeaters with the same name, will have to check
            // This is an edge case though
            return `const subFields = ${JSON.stringify(field.subFields, null, 2)}

module.exports = (Post, Postmeta) => {
return function ({ postId }) {
  return Post.findAll({
    where: {
      post_type: 'acf-field'
    }
  }).then(posts => {
    return Postmeta.findAll({
      where: {
        post_id: postId
      }
    }).then(postMetas => {
      if (postMetas.length > 0) {
        // Map the postMetas to their ACF fields, filtering those that don't have a match
        // Those remaining are instances of a repeater field group
        return postMetas.filter(pm => posts.map(p => p.post_name).includes(pm.meta_value))
          .map(pm => ({
            ...pm.dataValues,
            key: (
              subFields.find(({ subFieldName }) => subFieldName === posts.find(p => p.post_name === pm.meta_value).post_excerpt) ||
              {}
            ).subFieldLabel,
            value: postMetas.find(ppm => ppm.meta_key === pm.meta_key.substring(1))
              && postMetas.find(ppm => ppm.meta_key === pm.meta_key.substring(1)).meta_value,
            index: pm.meta_key.match(/^_${field.fieldName}_(\\d{1})/) && Number(pm.meta_key.match(/^_${field.fieldName}_(\\d{1})/)[1])
          }))
          // Filter those that didn't have an index appearing in the name of the meta_key
          .filter(pm => Number.isInteger(pm.index))
          // Organise the repeater fields into their respective entries
          .reduce((accumulator, currentValue) => {
            const group = accumulator.find(a => a.index === currentValue.index) || { index: currentValue.index }
            const newGroup = { ...group, [currentValue.key]: currentValue.value }
            return accumulator.filter(a => a.index !== currentValue.index).concat([ newGroup ])
          }, [])
          // Sort the entries
          .sort((a, b) => a.index > b.index)
      }
    })${field.subFields.filter(s => s.subFieldType === 'image').map(s =>
`.then(repeaterArray => {
      let repeaterArrayWithImages = []
      return repeaterArray.reduce((promise, repeaterEntry) => {
        return promise
          .then(result => {
            Post.findOne({
              where: {
                id: Number(repeaterEntry.${s.subFieldName})
              }
            }).then(result =>
              result
              ? repeaterArrayWithImages.push({
                ...repeaterEntry,
                ${s.subFieldName}: result.guid
              })
              : repeaterArrayWithImages.push(repeaterEntry)
            )
          })
      }, Promise.resolve())
      .then(() => repeaterArrayWithImages.sort((a, b) => a.index > b.index))
    })`).join('')}
  })
}
}
`
          case 'file':
          case 'image':
            return `const getField = require('./utility/getField')

module.exports = (Post, Postmeta) => {
  return function ({ postId }) {
    return Post.findOne(getField('${field.fieldName}')).then(post => {
      if (!post) return null
      return Postmeta.findOne({
        where: {
          meta_value: post.post_name
        }
      }).then(postMeta => {
        if (!postMeta) return null
        return Postmeta.findOne({
          where: {
            meta_key: postMeta.meta_key.substring(1),
            post_id: postId
          }
        })
      }).then(postMeta => {
        if (!postMeta) return null
        return Post.findOne({
          where: {
            id: Number(postMeta.meta_value)
          }
        }).then(post => {
          return post && post.guid
        })
      })
    })
  }
}
`
          case 'image_crop':
            return `const getField = require('./utility/getField')

module.exports = (Post, Postmeta) => {
  return function ({ postId }) {
    return Post.findOne(getField('${field.fieldName}')).then(post => {
      if (!post) return null
      return Postmeta.findOne({
        where: {
          meta_value: post.post_name
        }
      }).then(postMeta => {
        if (!postMeta) return null
        return Postmeta.findOne({
          where: {
            meta_key: postMeta.meta_key.substring(1),
            post_id: postId
          }
        })
      }).then(postMeta => {
        if (!postMeta || !postMeta.meta_value) return null
        return Post.findOne({
          where: {
            id: Number(JSON.parse(postMeta.meta_value).cropped_image)
          }
        }).then(post => {
          return post && post.guid
        })
      })
    })
  }
}
`
          default:
            return `const getField = require('./utility/getField')

module.exports = (Post, Postmeta) => {
  return function ({ postId }) {
    return Postmeta.findOne({
      where: {
        meta_key: '${field.fieldName}',
        post_id: postId
      }
    }).then(postMeta => postMeta && postMeta.meta_value)
  }
}
`
        }
      })()
    })
  )

module.exports.generateTemplate = generateTemplates
