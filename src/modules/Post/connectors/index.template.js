/* eslint-disable indent */

module.exports.generateTemplate = () => `\
const getPost = require('./getPost')
const getPosts = require('./getPosts')
const getCustomFields = require('./getCustomFields')
const getFeaturedImage = require('./getFeaturedImage')
// import getPostTerms from './getPostTerms'
// import getTermPosts from './getTermPosts'
// import getPostLayout from './getPostLayout'

module.exports = function ({ Post, Postmeta, Terms, TermRelationships, TermTaxonomy }, settings) {
  return {
    getPost: getPost(Post, TermTaxonomy, settings),
    getPosts: getPosts(Post, Terms, TermRelationships, TermTaxonomy, settings),
    getCustomFields: getCustomFields(Post, Postmeta),
    getFeaturedImage: getFeaturedImage(Post, Postmeta)
    // getPostTerms: getPostTerms(Terms, TermRelationships, settings),
    // getTermPosts: getTermPosts(TermRelationships, Post, settings),
    // getPostLayout: getPostLayout(Postmeta)
  }
}
`
