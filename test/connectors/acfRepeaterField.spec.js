/* global expect, describe, it */
const SequelizeMock = require('sequelize-mock')
const Sequelize = require('sequelize')

// const getAppleInformationApple_locations = require('../../lib/modules/CustomFields/connectors/getAppleInformationApple_locations')
const samplePostmetaData = require('./sampleData/Postmeta')
const samplePostData = require('./sampleData/Post')

/**
 * Here I am attempting to use sequelize-mock to create a mock database for testing
 * with generated resolver functions. I could not get it to work as intended.
 *
 * Skip for the time being.
 */
describe('acfRepeaterField', () => {
  it('retrieves all repeater subfields', async () => {
    const DBConnectionMock = new SequelizeMock()
    /**
     * See https://github.com/BlinkUX/sequelize-mock/blob/master/src/model.js
     * line 45 for default options passed to mock models
     */
    const PostMock = DBConnectionMock.define('post', {}, {
      autoQueryFallback: false,
      timestamps: false,
      hasPrimaryKeys: false
    })
    PostMock.$queueResult(samplePostData.data.map(s => PostMock.build(s)))
    // PostMock.$queueResult(PostMock.build())
    // const PostMetaMock = DBConnectionMock.define('postmeta', postMetaData)
    // PostMock.findAll().then(posts => console.log(posts.map(p => p.dataValues)))
    // PostMock.findAll().then(posts => console.log(posts.map(p => p.dataValues)))
    PostMock.findAll().then(posts => console.log(posts.map(p => p.ID)))
    // const value = await getAppleInformationApple_locations(PostMock, PostMetaMock)({ postId: 9 })
    // expect(value).toHaveLength(2)
  })
})
