/* global expect, describe, it */

const ACFStore = require('../../generate/acfstore')
const { generateTemplate: generateDbTemplate } = require('../../src/db.template.js')

describe('generate db file', () => {
  it('generateDbTemplate', () => {
    const a = new ACFStore()
    a.addCustomPostType('wp_apple')
    a.addFieldGroupRelation('wp_apple', 'Apple Information')
    a.addFieldGroup('Apple Information')
    a.addField('cultivar', 'Apple Information')
    expect(generateDbTemplate(a.customPostTypes, a.fieldGroups)).toMatchSnapshot()
  })
})
