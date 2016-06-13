var config = require('config3')
var theme = require('../theme')

function themeMW (req, res, next) {
  res.locals.css = '/' + config.appName + '.css'
  if (req.user) {
    var name = req.user.theme || theme.defaultTheme.name
    res.locals.css = '/' + config.appName + '-' + name + '.css'
  }
  next()
}

module.exports = themeMW
