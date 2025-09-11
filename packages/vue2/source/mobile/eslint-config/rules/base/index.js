const best = require('./best-practies')
const es6 = require('./es6')
const possible = require('./possible-errors')
const strict = require('./strict')
const style = require('./style')
const variables = require('./variables')

module.exports = {
  rules: {
    ...best.rules,
    ...es6.rules,
    ...possible.rules,
    ...strict.rules,
    ...style.rules,
    ...variables.rules,
  }
}