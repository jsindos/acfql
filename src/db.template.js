function generateTemplate (customPostTypes, fieldGroups) {
  return `const Sequelize = require('sequelize')

const PostModel = require('./modules/Post/model')
const PostmetaModel = require('./modules/Postmeta/model')
const { TermModel, TermRelationshipModel } = require('./modules/Term/model')

const PostConnectors = require('./modules/Post/connectors')
const PostmetaConnectors = require('./modules/Postmeta/connectors')
const CustomFieldsConnectors = require('./modules/CustomFields/connectors')

const dev = process.env.NODE_ENV !== 'production'
let increment = 1

class Database {
  constructor (settings) {
    this.settings = settings
    this.connection = this.connect(settings)
    this.connectors = this.getConnectors()
    this.models = this.getModels()
  }

  connect () {
    const { name, username, password, host, port } = this.settings.privateSettings.database

    const Conn = new Sequelize(
      name,
      username,
      password,
      {
        logging: dev
          ? (s) => console.log(\`\${increment++}: \${s}\`)
          : false,
        dialect: 'mysql',
        host: host,
        port: port || 3306,
        define: {
          timestamps: false,
          freezeTableName: true
        }
      }
    )

    return Conn
  }

  getModels () {
    const prefix = this.settings.privateSettings.wp_prefix
    const Conn = this.connection

    return {
      Post: PostModel(Conn, prefix),
      Postmeta: PostmetaModel(Conn, prefix),
      Terms: TermModel(Conn, prefix),
      TermRelationships: TermRelationshipModel(Conn, prefix),
    }
  }

  getConnectors () {
    const models = this.getModels()
    const { Post, Postmeta, Terms, TermRelationships } = models

    Terms.hasMany(TermRelationships,  { foreignKey: 'term_taxonomy_id' })
    TermRelationships.belongsTo(Terms, { foreignKey: 'term_taxonomy_id' })

    TermRelationships.hasMany(Postmeta, {foreignKey: 'post_id'})
    Postmeta.belongsTo(TermRelationships, {foreignKey: 'post_id'})

    Post.hasMany(TermRelationships, {foreignKey: 'object_id'})
    TermRelationships.belongsTo(Post, {foreignKey: 'object_id'})

    Post.hasMany(Postmeta, {foreignKey: 'post_id'})
    Postmeta.belongsTo(Post, {foreignKey: 'post_id'})

    return {
      ...PostConnectors(models),
      ...PostmetaConnectors(models),
      ...CustomFieldsConnectors(models)
    }
  }
}

module.exports = Database
`
}

module.exports.generateTemplate = generateTemplate
