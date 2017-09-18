const {jest: jestConfig} = require('kcd-scripts/config')

module.exports = Object.assign(jestConfig, {
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\](?!.+(\\.esm)).+\\.js'],
})
