// Copy config.local.sample.js to config.local.js
// Edit as necessary for your local setup.
// You only need to specify the values you need to change from the defaults.

/* eslint-disable max-len */
var config = exports
config.css = {
  debug: true
}
config.browserifyDebug = true
config.email = {
  enabled: false,
  auth: {
    xoauth2: {
      clientId: 'Get this from google',
      clientSecret: 'some gook from google',
      refreshToken: 'really long gook from google'
    }
  }
}
config.db = {
  host: 'your db host',
  password: 'your db password'
}
config.postgres = {
  host: config.db.host,
  password: 'your db admin password'
}
config.ip = '127.0.0.1'
