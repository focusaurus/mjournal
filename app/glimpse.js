const glimpseAgent = require('@glimpse/glimpse-node-agent')
const glimpseServer = require('@glimpse/glimpse-node-server')

glimpseServer.server.init()
glimpseAgent.agent.init({server: glimpseServer.server})

require('./server')
