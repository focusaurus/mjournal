#!/bin/bash
cd /home/app
exec /sbin/setuser www-data ./app/server.js >>/var/log/app.log 2>&1
