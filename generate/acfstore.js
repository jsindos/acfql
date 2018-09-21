const pluralize = require('pluralize')
const fs = require('fs')
const path = require('path')

const { concatenateArrayInObjectInArray, updateObjectInArray, camelize } = require('./utility')

class ACFStore {
  constructor () {
    this.customPostTypes = []
    this.fieldGroups = []
    this.INBUILT_TYPES = [ 'post', 'page' ]
    this.ALLOWED_LOCATION_PARAMS = [ 'post_type' ]
  }

  /**
   *
   * @param {*} customPostType
   * @param {String} locationParam Is the type of location
   * Can be one of 'post_type' | 'page' | 'post' | 'post_category' etc.
   * If it is 'page' or 'post', then the location is tied to a specific page or post
   * In this case customPostType will be the ID of the page or post
   *
   * Note when customPostType is a 'page' or 'post', we only want to generate the connector for the associated fieldGroups,
   * and not generate anything in the resolvers or the schema
   *
   * We do this by disallowing the customPostType when it is added, using enumerated `this.INBUILT_TYPES`
   * and adding a check to resolvers.template.js and `addFieldGroup` to test for the aforementioned condition
   */
  addCustomPostType (customPostType, locationParam) {
    if (
      this.INBUILT_TYPES.includes(customPostType) ||
      Number.isInteger(Number(customPostType)) ||
      !this.ALLOWED_LOCATION_PARAMS.includes(locationParam)
    ) return
    this.customPostTypes = this.customPostTypes.find(c => c.fullName === customPostType)
      ? this.customPostTypes
      : this.customPostTypes.concat([ {
        fullName: customPostType,
        pluralizedName: pluralize.plural(camelize(customPostType.replace(/^wp_/, ''))),
        fullCaseName: camelize(customPostType.replace(/^wp_/, ''), true),
        camelizedName: camelize(customPostType.replace(/^wp_/, '')),
        fieldGroups: []
      } ])
  }

  addFieldGroupRelation (customPostType, fieldGroupName, locationParam) {
    if (
      this.INBUILT_TYPES.includes(customPostType) ||
      Number.isInteger(Number(customPostType)) ||
      !this.ALLOWED_LOCATION_PARAMS.includes(locationParam)
    ) return
    this.customPostTypes = concatenateArrayInObjectInArray(this.customPostTypes, {
      find: [ 'fullName', customPostType ],
      update: [ camelize(fieldGroupName) ],
      updateKey: 'fieldGroups'
    })
  }

  /**
   *
   * @param {*} fieldGroupName
   *
   * If we cannot find an associated customPostType, then the fieldGroup should only render as a connector function
   * and not as a resolver
   * @see addCustomPostType
   */
  addFieldGroup (fieldGroupName) {
    this.fieldGroups = this.fieldGroups.find(f => f.fullName === fieldGroupName)
      ? this.fieldGroups
      : this.fieldGroups.concat([ {
        fullCaseName: camelize(fieldGroupName, true),
        fullName: fieldGroupName,
        fields: [],
        resolverFieldGroup: Boolean(this.customPostTypes
          .find(c => c.fieldGroups.find(g => g === camelize(fieldGroupName))))
      } ])
  }

  addField (fieldName, fieldGroupName, type = 'text') {
    this.fieldGroups = concatenateArrayInObjectInArray(this.fieldGroups, {
      find: [ 'fullName', fieldGroupName ],
      update: [ {
        fullName: camelize(fieldName),
        connectorName: camelize(`get ${fieldGroupName} ${fieldName}`),
        type,
        fieldName: fieldName,
        subFields: []
      } ],
      updateKey: 'fields'
    })
  }

  /**
   * Adds a subfield to a field. Only used by repeater fields.
   * @param {String} fieldName
   * @param {String} fieldGroupName
   * @param {String} subFieldName
   *
   * TODO: If called twice with the same arguments, will double up results. We do not want this behaviour.
   */
  addFieldSubField (fieldName, fieldGroupName, { subFieldName, subFieldType }) {
    const newFields = concatenateArrayInObjectInArray(
      this.fieldGroups.find(g => g.fullName === fieldGroupName).fields,
      {
        find: [ 'fieldName', fieldName ],
        update: [ { subFieldName, subFieldType } ],
        updateKey: 'subFields'
      }
    )
    this.fieldGroups = updateObjectInArray(this.fieldGroups, {
      find: [ 'fullName', fieldGroupName ],
      update: newFields,
      updateKey: 'fields'
    })
  }

  /**
   * Parse the ACF JSON exports into the ACFStore
   */
  parse (DIR) {
    fs.readdirSync(DIR).forEach(file => {
      this.parseFile(file, DIR)
    })
  }

  /**
   * Parse a single ACF JSON export
   * @param {*} file
   * @param {*} DIR
   * @returns fieldGroups added
   */
  parseFile (file, DIR) {
    const json = JSON.parse(fs.readFileSync(path.join(process.cwd(), DIR, file), 'utf8'))
    json.forEach(fieldGroup => {
      fieldGroup.location.forEach(location => {
        location.forEach(l => {
          this.addCustomPostType(l.value, l.param)
          this.addFieldGroupRelation(l.value, fieldGroup.title, l.param)
        })
      })
      this.addFieldGroup(fieldGroup.title)
      fieldGroup.fields.forEach(field => {
        this.addField(field.name, fieldGroup.title, field.type)
        if (field.type === 'repeater') {
          field.sub_fields.forEach(subField => {
            this.addFieldSubField(field.name, fieldGroup.title, { subFieldName: subField.name, subFieldType: subField.type })
          })
        }
      })
    })
    const addedFieldGroups = json.map(j => j.title)
    return [ json, this.fieldGroups.filter(g => addedFieldGroups.includes(g.fullName)) ]
  }
}

module.exports = ACFStore
