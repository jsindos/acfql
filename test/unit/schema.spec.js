/* global expect, describe, it */

const ACFStore = require('../../generate/acfstore')
const { generateTemplate: generateSchemaTemplate } = require('../../src/schema/schema.template.js')
const { generateTemplate: generateCustomPostTypeTemplate } = require('../../src/schema/customPostTypes/CustomPostType.template.js')
const { generateTemplate: generateFieldGroupTemplate } = require('../../src/schema/fieldGroups/FieldGroup.template.js')

describe('generate schema files', () => {
  it('generateSchemaTemplate', () => {
    const a = new ACFStore()
    a.addCustomPostType('wp_apple')
    a.addFieldGroupRelation('wp_apple', 'Apple Information')
    a.addFieldGroup('Apple Information')
    expect(generateSchemaTemplate(a.customPostTypes, a.fieldGroups)).toMatchSnapshot()
  })

  it('generateCustomPostTypeTemplate', () => {
    const a = new ACFStore()
    a.addCustomPostType('wp_apple', 'post_type')
    a.addFieldGroupRelation('wp_apple', 'Apple Information', 'post_type')
    a.addFieldGroupRelation('wp_apple', 'Other Information', 'post_type')
    a.addFieldGroup('Apple Information')
    const templates = generateCustomPostTypeTemplate(a.customPostTypes, a.fieldGroups)
    expect(templates.find(t => t.fileName === 'Apple').template).toMatchSnapshot()
  })

  it('generateFieldGroupTemplate', () => {
    const a = new ACFStore()
    a.addCustomPostType('wp_apple')
    a.addFieldGroupRelation('wp_apple', 'Apple Information')
    a.addFieldGroupRelation('wp_apple', 'Other Information')
    a.addFieldGroup('Apple Information')
    a.addField('cultivar', 'Cultivar', 'Apple Information')
    a.addField('price', 'Price', 'Apple Information')
    const templates = generateFieldGroupTemplate(a.customPostTypes, a.fieldGroups)
    expect(templates.find(t => t.fileName === 'AppleInformation').template).toMatchSnapshot()
  })
})
