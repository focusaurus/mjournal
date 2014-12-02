#!/bin/bash
cd /home/app
exec su www-data \
  --command '/usr/bin/env NODE_ENV=production ./app/server.js' \
  >> /var/log/app.log 2>&1
