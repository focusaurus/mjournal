#!/bin/sh
runTestsPostgres() {
  psql --username=mjournal --dbname=mjournal-test --file=app/db/postgres/destroyData.sql
  NODE_ENV=test MJ_DB_URL="postgres://mjournal@localhost/mjournal-test" mocha ${ARGS}
}

cd $(dirname "${0}")/../..
ARGS=""
if [ "${1}" == "--debug" ]; then
  ARGS="--timeout 0 --debug-brk=9093 ${@}"
fi
runTestsPostgres "${ARGS}"
