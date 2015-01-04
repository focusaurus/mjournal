#!/bin/bash
cd "$(dirname $0)/.."
PATH=./node_modules/.bin:$PATH
browserify -e ./app/browser.js | uglifyjs --no-mangle > wwwroot/mjournal.js
