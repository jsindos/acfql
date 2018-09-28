/* global expect, describe, it */

const ACFStore = require('../../generate/acfstore')
const { generateTemplate: generateIndexTemplate } = require('../../src/modules/CustomFields/connectors/index.template.js')
const { generateTemplate: generateGetFieldTemplate } = require('../../src/modules/CustomFields/connectors/getField.template.js')

describe('generate module files', () => {
  it('generateIndexTemplate', () => {
    const a = new ACFStore()
    a.addFieldGroup('Apple Information')
    a.addField('cultivar', 'Cultivar', 'Apple Information')
    a.addField('price', 'Price', 'Apple Information')
    a.addFieldGroup('Other Information')
    a.addField('other', 'Other', 'Other Information')
    expect(generateIndexTemplate(a.customPostTypes, a.fieldGroups)).toMatchSnapshot()
  })

  it('generateFieldTemplate', () => {
    const a = new ACFStore()
    a.addFieldGroup('Apple Information')
    a.addField('cultivar', 'Cultivar', 'Apple Information')
    a.addField('price', 'Price', 'Apple Information')
    a.addFieldGroup('Other Information')
    a.addField('other', 'Other', 'Other Information')
    const templates = generateGetFieldTemplate(a.customPostTypes, a.fieldGroups)
    expect(templates.find(t => t.fileName === 'getAppleInformationCultivar').template).toMatchSnapshot()
  })
})
