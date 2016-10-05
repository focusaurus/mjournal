var glimpseAgent = require('@glimpse/glimpse-node-agent'),
    glimpseServer = require('@glimpse/glimpse-node-server');

glimpseServer.server.init();
glimpseAgent.agent.init({
    server: glimpseServer.server
});

require('./server');
