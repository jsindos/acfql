/* eslint-disable no-eval */
/* global expect, describe, it */

const path = require('path')

const ACFStore = require('../../generate/acfstore')
require.context = require('../../generate/requireContextPolyfill')

describe('acfstore', () => {
  it('throws SyntaxError due to naming duplication between fieldGroup and customPostType', () => {
    /**
     * Get a list of our schema generation template files, using a require.context polyfill
     */
    const templates = require.context(path.join(__dirname, '..', '..'), true, /(?!.*node_modules).*\.template\.js$/)

    /**
     * Create the ACFStore that will store the information from our ACF JSON exports
     */
    const store = new ACFStore()

    /**
     * The directory containing our ACF JSON exports
     */
    const DIR = './test/acfstore/dummyData'

    /**
     * Parse the ACF JSON exports into the ACFStore
     */
    store.parse(DIR)

    // console.log(JSON.stringify(store.fieldGroups, null, 2))

    const customPostTypeTemplates = templates['src/schema/customPostTypes/CustomPostType.template.js']
      .generateTemplate(store.customPostTypes, store.fieldGroups)

    // SyntaxError: Identifier 'TeamMember' has already been declared
    expect(() => eval(customPostTypeTemplates[0].template)).toThrow()
  })
})
