#!/bin/bash
cd "$(dirname $0)/.."
PATH=./node_modules/.bin:$PATH
browserify -e ./app/browser.js | uglifyjs --compress --screw-ie8 - > wwwroot/mjournal.js
