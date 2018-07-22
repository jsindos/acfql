/* global expect, describe, it */

const ACFStore = require('../../generate/acfstore')
const { concatenateArrayInObjectInArray, camelize } = require('../../generate/utility')

describe('acfstore', () => {
  describe('utility functions', () => {
    it('concatenateArrayInObjectInArray', () => {
      const fieldGroups = [ { foo: 'bar' }, {
        fullName: 'Apple Information',
        fields: [
          {
            fullName: 'price',
            connectorName: 'getAppleInformationPrice'
          }
        ]
      } ]
      const update = concatenateArrayInObjectInArray(fieldGroups, {
        find: [ 'fullName', 'Apple Information' ],
        update: [ {
          fullName: 'cultivar',
          connectorName: camelize(`get Apple Information cultivar`)
        } ],
        updateKey: 'fields'
      })
      expect(update.find(u => u.fullName === 'Apple Information').fields).toHaveLength(2)
      expect(update).toMatchSnapshot()
    })

    it('concatenateArrayInObjectInArray initial', () => {
      // `fields` needs to be initialised as empty array
      const fieldGroups = [ { fullName: 'Apple Information', fields: [] } ]
      const update = concatenateArrayInObjectInArray(fieldGroups, {
        find: [ 'fullName', 'Apple Information' ],
        update: [ {
          fullName: 'cultivar',
          connectorName: camelize(`get Apple Information cultivar`)
        } ],
        updateKey: 'fields'
      })
      expect(update.find(u => u.fullName === 'Apple Information').fields).toHaveLength(1)
    })
  })

  describe('ACFStore', () => {
    it('addFieldGroupRelation', () => {
      const a = new ACFStore()
      a.addCustomPostType('wp_apple', 'post_type')
      a.addFieldGroupRelation('wp_apple', 'Apple Information', 'post_type')
      expect(a.customPostTypes.find(c => c.fullName === 'wp_apple').fieldGroups).toHaveLength(1)
    })

    it('addFieldGroupRelation pluralizes and camelizes', () => {
      const a = new ACFStore()
      a.addCustomPostType('wp_team_member', 'post_type')
      a.addFieldGroupRelation('wp_team_member', 'Apple Information', 'post_type')
      expect(a.customPostTypes.find(c => c.pluralizedName === 'teamMembers')).toBeTruthy()
    })

    it('addField camelizes', () => {
      const a = new ACFStore()
      a.addFieldGroup('Apple Information')
      a.addField('ripening_time', 'Apple Information')
      expect(a.fieldGroups.find(g => g.fullName === 'Apple Information').fields.find(f => f.fullName === 'ripeningTime')).toBeTruthy()
    })

    it('addCustomPostType doesn\'t add INBUILT_TYPES', () => {
      const a = new ACFStore()
      a.addCustomPostType('post')
      a.addCustomPostType('page')
      expect(a.customPostTypes).toHaveLength(0)
    })

    it('addFieldGroup marks field groups as nonResolverFieldGroup when a fieldGroupRelation isn\'t found', () => {
      const a = new ACFStore()
      a.addFieldGroup('Apple Information')
      expect(a.fieldGroups.find(g => g.fullName === 'Apple Information').resolverFieldGroup).toBeFalsy()
      a.addCustomPostType('wp_apple', 'post_type')
      a.addFieldGroupRelation('wp_apple', 'Other Information', 'post_type')
      a.addFieldGroup('Other Information')
      expect(a.fieldGroups.find(g => g.fullName === 'Other Information').resolverFieldGroup).toBeTruthy()
    })

    it('addFieldSubField', () => {
      const a = new ACFStore()
      a.addFieldGroup('Apple Information')
      a.addField('images', 'Apple Information', 'repeater')
      a.addFieldSubField('images', 'Apple Information', { subFieldName: 'image', subFieldType: 'image' })
      expect(a.fieldGroups).toMatchSnapshot()
    })
  })
})
