#!/bin/sh
runTestsPostgres() {
  psql --username=mjournal --dbname=mjournal-test --file=app/db/postgres/destroyData.sql
  NODE_ENV=test MJ_DB_URL="postgres://mjournal@localhost/mjournal-test" mocha "$@"
}

cd $(dirname "$0")/../..
ARGS="--reporter spec --colors --compilers coffee:coffee-script --recursive --slow 200"
if [ "${1}" == "--debug" ]; then
  ARGS="--timeout 0 --debug-brk=9093 ${@}"
fi
TEST_DIRS=$(find app -type d -name tests | xargs)
runTestsPostgres ${ARGS} ${TEST_DIRS}
