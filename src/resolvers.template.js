/* eslint-disable indent */

module.exports.generateTemplate = (customPostTypes, fieldGroups) =>
`function Resolvers (Connectors) {
  const Resolvers = {
    Query: {
      ${customPostTypes.map(c =>
      `
      ${c.pluralizedName} (_, { language }) {
        return Connectors.getPosts({ postType: '${c.fullName}', language })
      },
      ${c.camelizedName} (_, { name, id }) {
        return Connectors.getPost({ postType: '${c.fullName}', name, id })
      },
      `
      ).join('')}
      post (_, { name, id, postType }) {
        return Connectors.getPost({ name, id, postType })
      },
      posts (_, { category, postType, language }) {
        return Connectors.getPosts({ category, postType, language })
      }
    },

    Post: {
      customFields (post) {
        return Connectors.getCustomFields({ postId: post.ID })
      },
      featuredImage (post) {
        return Connectors.getFeaturedImage({ postId: post.ID })
      }
    },
    
    ${customPostTypes.map(c => `\
    ${c.fullCaseName}: {
      featuredImage (post) {
        return Connectors.getFeaturedImage({ postId: post.ID })
      },
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
        return Connectors.${f.connectorName}({ postId: post.ID })
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
