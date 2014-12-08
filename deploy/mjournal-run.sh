#!/bin/bash
cd /home/app
export NODE_ENV=production
exec start-stop-daemon --start -c www-data --exec \
  $(pwd)/app/server.js >> /var/log/app.log 2>&1
