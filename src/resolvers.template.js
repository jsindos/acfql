module.exports.generateTemplate = (customPostTypes, fieldGroups) =>
`function Resolvers (Connectors) {
  const Resolvers = {
    Query: {
      ${customPostTypes.map(c =>
      `
      ${c.pluralizedName} () {
        return Connectors.getPosts({ postType: '${c.fullName}' })
      },
      ${c.camelizedName} (_, { name, id }) {
        return Connectors.getPost({ postType: '${c.fullName}', name, id })
      },
      `
      ).join('')}
      post (_, { name, id, postType }) {
        return Connectors.getPost({ name, id, postType })
      },
      posts (_, { category, postType }) {
        return Connectors.getPosts({ category, postType })
      }
    },

    Post: {
      customFields (post) {
        return Connectors.getCustomFields({ postId: post.id })
      }
    },
    
    ${customPostTypes.map(c =>
    `
    ${c.fullCaseName}: {
      ${c.fieldGroups.map(f =>
      `
      ${f} (post) {
        return post
      },
      `
      ).join('')}
    },
    `
    ).join('')}
    ${fieldGroups.filter(g => g.resolverFieldGroup).map(g =>
    `
    ${g.fullCaseName}: {
      ${g.fields.map(f =>
      `
      ${f.fullName} (post) {
        return Connectors.${f.connectorName}({ postId: post.id })
      },
      `
      ).join('')}
    },
    `
    ).join('')
    }
  }

  return Resolvers
}

module.exports = Resolvers
`
