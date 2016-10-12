const bole = require('bole')
const config = require('config3')

bole.output({
  level: 'debug',
  stream: config.MJ_LOG_STREAM
})

module.exports = bole(config.MJ_APP_NAME)
