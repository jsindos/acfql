const spawn = require('cross-spawn')
const path = require('path')

const pattern = 'test/[^/]+/.+\\.spec\\.js'

const result = spawn.sync(
  path.normalize('./node_modules/.bin/jest'),
  [pattern, ...process.argv],
  { stdio: 'inherit' }
)

process.exit(result.status)
