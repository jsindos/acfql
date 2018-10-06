/* global expect, describe, it, beforeEach */
const SequelizeMock = require('sequelize-mock')
const { toMatchOneOf, toMatchShapeOf } = require('jest-to-match-shape-of')

const applyHandlers = require('../utilities').applyHandlers

const getCustomFields = require('../../graphql/modules/Post/connectors/getCustomFields')

const samplePostmetaData = require('./sampleData2/Postmeta')
const samplePostData = require('./sampleData2/Post')

expect.extend({
  toMatchOneOf,
  toMatchShapeOf
})

describe('nestedFieldGroups', () => {
  let PostMock, PostmetaMock
  beforeEach(async () => {
    const DBConnectionMock = new SequelizeMock()
    /**
     * See https://github.com/BlinkUX/sequelize-mock/blob/master/src/model.js
     * line 45 for default options passed to mock models
     */
    PostMock = DBConnectionMock.define('post', {}, {
      autoQueryFallback: false,
      timestamps: false,
      hasPrimaryKeys: false
    })
    PostmetaMock = DBConnectionMock.define('postmeta', {}, {
      autoQueryFallback: false,
      timestamps: false,
      hasPrimaryKeys: false
    })
    /**
     * https://github.com/BlinkUX/sequelize-mock/issues/43
     * https://sequelize-mock.readthedocs.io/en/latest/docs/mock-queries/
     * Each query will return the first available result from the list.
     * 1. The value generated by a query handler
     * 2. If not available, the next result queued for the object the query is being run on
     * 3. If not available, it will return the next result queued for any parent object. For Models, this is the Sequelize object the Model was defined with (using db.define)
     * 4. If not available and being called on a Model, it will return an automatically generated result based on the defaults of the Model being queried, unless configured otherwise
     * 5. Any fallback function defined in the configuration for the object
     */
    applyHandlers(PostmetaMock, samplePostmetaData)
    applyHandlers(PostMock, samplePostData)
    // PostMock.$queueResult(samplePostData.data.map(s => PostMock.build(s)))
    // PostmetaMock.$queueResult(samplePostmetaData.data.map(s => PostmetaMock.build(s)))
  })

  it('retrieves fields for post and page custom fields nested under the field group name', async () => {
    const customFields = await getCustomFields(PostMock, PostmetaMock)({ postId: 40 })
    // Retrieves fields that have the same name under different field groups
    expect(customFields).toMatchShapeOf({
      appleInformation: {
        location: ''
      },
      orangeInformation: {
        location: ''
      }
    })
    expect(customFields.appleInformation.location).toEqual('Apple')
    expect(customFields.orangeInformation.location).toEqual('Orange')
  })

  it('retrieves repeater fields that have the same name under different field groups', async () => {
    const customFields = await getCustomFields(PostMock, PostmetaMock)({ postId: 40 })
    // console.log(JSON.stringify(customFields))
    expect(customFields).toMatchShapeOf({
      appleInformation: {
        photos: [
          {
            photo: ''
          }
        ]
      }
    })
    expect(customFields.appleInformation.photos).toContainEqual(expect.objectContaining({ photo: 'apple_photo_one' }))
  })

  it('repeater field image', async () => {
    const customFields = await getCustomFields(PostMock, PostmetaMock)({ postId: 40 })
    // console.log(JSON.stringify(customFields))
    expect(customFields).toMatchShapeOf({
      orangeInformation: {
        photos: [
          {
            photo: '',
            otherPhoto: ''
          }
        ]
      }
    })
    expect(customFields.orangeInformation.photos).toContainEqual(expect.objectContaining({
      photo: 'http://testpress.localhost/wp-content/uploads/2018/10/Emma-Watson-Wallpapers-sayou-30461666-1600-1200-1.jpg',
      otherPhoto: 'http://testpress.localhost/wp-content/uploads/2018/10/IMG_0376.jpg'
    }))
  })
})
