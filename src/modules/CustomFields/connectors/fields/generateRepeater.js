/* eslint-disable indent */

/**
 * Unsure if repeater field logic is sound against multiple repeaters with the same name
 */
module.exports = (field) => `\
const subFields = ${JSON.stringify(field.subFields, null, 2)}

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
  `.then(async repeaterArray => {
        const values = await repeaterArray.reduce(async (repeaterArrayWithImages, repeaterEntry) => {
          const resolvedRepeaterArrayWithImages = await repeaterArrayWithImages
          const image = await Post.findOne({
            where: {
              ID: Number(repeaterEntry.${s.subFieldLabel})
            }
          })
          if (image) {
            return resolvedRepeaterArrayWithImages.concat([
              {
                ...repeaterEntry,
                ${s.subFieldLabel}: image.guid
              }
            ])
          } else {
            return resolvedRepeaterArrayWithImages.concat([ repeaterEntry ])
          }
        }, [])
        return values.sort((a, b) => a.index > b.index)
      })`).join('')}
    })
  }
}
`
