const config = require('config3')
const settings = {
  client: 'postgresql',
  connection: {
    database: config.MJ_PG_DATABASE,
    host: config.MJ_PG_HOST,
    password: config.MJ_PG_PASSWORD,
    port: config.MJ_PG_PORT,
    user: config.MJ_PG_USER
  }
}
exports[process.env.NODE_ENV] = settings
