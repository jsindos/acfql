/* global expect, describe, it */
// const SequelizeMock = require('sequelize-mock')

// const getAppleInformationApple_locations = require('../../lib/modules/CustomFields/connectors/getAppleInformationApple_locations')
// const postMetaData = require('./sampleData/postmeta')
// const postData = require('./sampleData/posts')

/**
 * Here I am attempting to use sequelize-mock to create a mock database for testing
 * with generated resolver functions. I could not get it to work as intended.
 * 
 * Skip for the time being.
 */
describe('acfRepeaterField', () => {
    it.skip('retrieves all repeater subfields', async () => {
      const DBConnectionMock = new SequelizeMock()
      const PostMock = DBConnectionMock.define('post')
      const PostMetaMock = DBConnectionMock.define('postmeta', postMetaData)
      // PostMock.findAll({ where: { id: 1 }}).then(posts => console.log(posts.map(p => p.dataValues)))
      const value = await getAppleInformationApple_locations(PostMock, PostMetaMock)({ postId: 9 })
      expect(value).toHaveLength(2)
    })
})
