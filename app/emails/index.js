var _ = require('lodash')
var config = require('config3')
var log = require('app/log')
var nodemailer = require('nodemailer')
var xoauth2 = require('xoauth2')

var transport
var BOGUS_RESULT = {
  'accepted': [],
  'rejected': [],
  'response': '250 2.0.0 OK FAKE FAKE - gsmtp',
  'envelope': {
    'from': '',
    'to': []
  },
  'messageId': 'FAKE-MESSAGE-ID@gmail.com'
}

function send (email, callback) {
  if (!transport) {
    log.debug('Initializing email transport for first message')
    var generator = xoauth2.createXOAuth2Generator(config.email.auth.xoauth2)
    var options = _.clone(config.email)
    options.auth.xoauth2 = generator
    transport = nodemailer.createTransport(options)
  }
  if (config.email.enabled) {
    log.debug(email, 'Sending email')
    transport.sendMail(email, function (error, result) {
      if (error) {
        log.error(error, 'error sending email')
      }
      log.debug(result, 'email sent OK')
      callback(error, result)
    })
  } else {
    log.debug(email, 'Email disabled. NOT SENDING.')
    callback(null, BOGUS_RESULT)
  }
}

exports.send = send
