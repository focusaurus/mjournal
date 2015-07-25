var log = require('app/log')

function sendResult (res) {
  return function (error, result) {
    if (error) {
      if (error.status >= 500) {
        log.error(error, 'API operation server error')
      } else {
        log.debug(error, 'API client error')
      }
      res.status(error.status || 500)
      res.send()
      return
    }
    if (!result) {
      res.status(404)
      res.send()
      return
    }
    res.send(result)
  }
}

module.exports = {
  sendResult: sendResult
}
