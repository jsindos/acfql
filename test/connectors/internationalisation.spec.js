/* global expect, describe, it, beforeEach */
const SequelizeMock = require('sequelize-mock')

const applyHandlers = require('../utilities').applyHandlers

const getAppleInformationLocation = require('../../graphql/modules/CustomFields/connectors/getAppleInformationLocation')
const getPosts = require('../../graphql/modules/Post/connectors/getPosts')

const samplePostmetaData = require('./i18nSampleData/Postmeta')
const samplePostData = require('./i18nSampleData/Post')
const sampleTermTaxonomyData = require('./i18nSampleData/TermTaxonomy')

describe('internationalisation', () => {
  let PostMock, PostmetaMock, TermTaxonomyMock
  const i18nEnabledSettings = { privateSettings: { languageEnabled: true } }
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
    TermTaxonomyMock = DBConnectionMock.define('term_taxonomy', {}, {
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
    applyHandlers(TermTaxonomyMock, sampleTermTaxonomyData)
    // PostMock.$queueResult(samplePostData.data.map(s => PostMock.build(s)))
    // PostmetaMock.$queueResult(samplePostmetaData.data.map(s => PostmetaMock.build(s)))
  })

  it('retrieves information according to a generated resolver', async () => {
    // PostMock.findAll({
    //   where: {
    //     ID: 1
    //   }
    // }).then(posts => console.log(posts.map(p => p.ID)))
    const appleInformationLocation = await getAppleInformationLocation(PostMock, PostmetaMock)({ postId: 8 })
    expect(appleInformationLocation).toEqual('Queensland')
  })

  it('retrieves post according to translation argument', async () => {
    let apples
    apples = await getPosts(PostMock, null, null, TermTaxonomyMock, i18nEnabledSettings)({ postType: 'wp_apple', language: 'en' })
    expect(apples).toHaveLength(2)
    expect(apples).toContainEqual(
      expect.objectContaining({ post_title: 'Granny Smith' })
    )
    expect(apples).toContainEqual(
      expect.objectContaining({ post_title: 'Pink Lady' })
    )
    apples = await getPosts(PostMock, null, null, TermTaxonomyMock, i18nEnabledSettings)({ postType: 'wp_apple', language: 'da' })
    expect(apples).toHaveLength(1)
    expect(apples).toContainEqual(
      expect.objectContaining({ post_title: 'Lyserød Dame' })
    )
  })

  it('retrieves `en` as the default language', async () => {
    let apples
    apples = await getPosts(PostMock, null, null, TermTaxonomyMock, i18nEnabledSettings)({ postType: 'wp_apple' })
    expect(apples).toHaveLength(2)
    expect(apples).toContainEqual(
      expect.objectContaining({ post_title: 'Granny Smith' })
    )
    expect(apples).toContainEqual(
      expect.objectContaining({ post_title: 'Pink Lady' })
    )
  })
})
