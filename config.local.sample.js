// Copy config.local.sample.js to config.local.js
// Edit as necessary for your local setup.
// You only need to specify the values you need to change from the defaults.

/* eslint-disable max-len */
exports.MJ_DEBUG_CSS = true
exports.MJ_EMAIL_CLIENT_ID = 'Get this from google'
exports.MJ_EMAIL_CLIENT_SECRET = 'some gook from google'
exports.MJ_EMAIL_REFRESH_TOKEN = 'really long gook from google'
exports.MJ_IP = '127.0.0.1'
exports.MJ_PG_ADMIN_PASSWORD = process.env.MJ_PG_ADMIN_PASSWORD || 'your db admin password'
exports.MJ_PG_ADMIN_USER = 'your db admin user'
exports.MJ_PG_HOST = 'your db host'
exports.MJ_PG_PASSWORD = process.env.MJ_PG_PASSWORD || 'your db password'
