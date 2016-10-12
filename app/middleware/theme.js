const config = require('config3')
const theme = require('../theme')

function themeMW (req, res, next) {
  res.locals.css = '/' + config.MJ_APP_NAME + '.css'
  if (req.user) {
    const name = req.user.theme || theme.defaultTheme.name
    res.locals.css = '/' + config.MJ_APP_NAME + '-' + name + '.css'
  }
  next()
}

module.exports = themeMW
