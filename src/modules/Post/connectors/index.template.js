module.exports.generateTemplate = () =>
  `const getPost = require('./getPost')
const getPosts = require('./getPosts')
const getCustomFields = require('./getCustomFields')
// import getPostTerms from './getPostTerms'
// import getTermPosts from './getTermPosts'
// import getPostLayout from './getPostLayout'

module.exports = function ({ Post, Postmeta, Terms, TermRelationships }, settings) {
  return {
    getPost: getPost(Post),
    getPosts: getPosts(Post, Terms, TermRelationships, settings),
    getCustomFields: getCustomFields(Post, Postmeta),
    // getPostTerms: getPostTerms(Terms, TermRelationships, settings),
    // getTermPosts: getTermPosts(TermRelationships, Post, settings),
    // getPostLayout: getPostLayout(Postmeta)
  }
}
`
