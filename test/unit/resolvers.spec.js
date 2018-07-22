/* global expect, describe, it */

const ACFStore = require('../../generate/acfstore')
const { generateTemplate: generateResolversTemplate } = require('../../src/resolvers.template.js')

describe('generate resolvers file', () => {
  it('generateResolversTemplate', () => {
    const a = new ACFStore()
    a.addCustomPostType('wp_pear')
    a.addCustomPostType('wp_apple')
    a.addFieldGroupRelation('wp_apple', 'Apple Information')
    a.addFieldGroupRelation('wp_apple', 'Other Information')
    a.addFieldGroup('Apple Information')
    a.addField('cultivar', 'Apple Information')
    a.addField('price', 'Apple Information')
    a.addField('ripening_time', 'Apple Information')
    expect(generateResolversTemplate(a.customPostTypes, a.fieldGroups)).toMatchSnapshot()
  })
})
