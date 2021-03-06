/* global expect, describe, it, beforeEach */
const SequelizeMock = require('sequelize-mock')
const { toMatchOneOf, toMatchShapeOf } = require('jest-to-match-shape-of')

const applyHandlers = require('../../utilities').applyHandlers

const getCustomFields = require('./graphql/modules/Post/connectors/getCustomFields')
const getOrangeInformationPhoto = require('./graphql/modules/CustomFields/connectors/getOrangeInformationPhoto')
const getOrangeInformationPhotos = require('./graphql/modules/CustomFields/connectors/getOrangeInformationPhotos')

const samplePostmetaData = require('./testData#11-02-2019/Postmeta')
const samplePostData = require('./testData#11-02-2019/Post')

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

  it('image custom fields sourced from a page or post are nested under `src`', async () => {
    const customFields = await getCustomFields(PostMock, PostmetaMock)({ postId: 24 })
    expect(customFields).toMatchShapeOf({
      orangeInformation: {
        photo: {
          src: ''
        },
        photos: [
          {
            photo: {
              src: ''
            }
          }
        ]
      }
    })
    expect(customFields.orangeInformation.photo).objectContaining(
      { src: 'http://testpress.test/wp-content/uploads/2019/02/IMG_0375.jpg' }
    )
    expect(customFields.orangeInformation.photos).toContainEqual(
      expect.objectContaining({ photo: { src: 'http://testpress.test/wp-content/uploads/2019/02/IMG_0267.jpg' } })
    )
  })

  it('image field nested under `src`', async () => {
    const photo = await getOrangeInformationPhoto(PostMock, PostmetaMock)({ postId: 29 })
    expect(photo).toMatchShapeOf({
      src: ''
    })
    expect(photo.src).toContainEqual('http://testpress.test/wp-content/uploads/2019/02/IMG_0375.jpg')
  })

  it.only('image repeater field nested under `src`', async () => {
    const photos = await getOrangeInformationPhotos(PostMock, PostmetaMock)({ postId: 29 })
    expect(photos).toMatchShapeOf({
      photo: {
        src: ''
      }
    })
    expect(photos).toContainEqual(
      expect.objectContaining({ photo: { src: 'http://testpress.test/wp-content/uploads/2019/02/IMG_0267.jpg' } })
    )
  })
})
