module.exports.generateTemplate = () =>
  `module.exports = (fieldName) => ({
  where: {
    post_type: 'acf-field',
    post_excerpt: fieldName,
    post_status: 'publish'
  }
})
`
