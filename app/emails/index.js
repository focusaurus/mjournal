'use strict'

const config = require('config3')
const log = require('../log')
const nodemailer = require('nodemailer')
const xoauth2 = require('xoauth2')

let transport
const BOGUS_RESULT = {
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
    const generator = xoauth2.createXOAuth2Generator({
      user: config.MJ_EMAIL_USER,
      clientId: config.MJ_EMAIL_CLIENT_ID,
      clientSecret: config.MJ_EMAIL_CLIENT_SECRET,
      refreshToken: config.MJ_EMAIL_REFRESH_TOKEN,
      timeout: 3600
    })
    const options = {
      enabled: config.MJ_ENABLE_EMAIL,
      service: config.MJ_EMAIL_SERVICE,
      to: config.MJ_EMAIL_TO,
      from: config.MJ_EMAIL_FROM,
      auth: {
        xoauth2: generator
      }
    }
    transport = nodemailer.createTransport(options)
  }
  if (config.MJ_ENABLE_EMAIL) {
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
