#!/bin/sh
runTestsSqlite() {
  DB_PATH="var/mj-test.sqlite"
  > "${DB_PATH}"
  cat app/ddl/users.sql | sqlite3 "${DB_PATH}"
  NODE_ENV=test MJ_DB_URL="sqlite3://${DB_PATH}" mocha ${ARGS}
}

runTestsPostgres() {
  psql --username=mjournal --dbname=mjournal-test --file=app/db/postgres/destroyData.sql
  NODE_ENV=test MJ_DB_URL="postgres://mjournal@localhost/mjournal-test" mocha ${ARGS}
}

cd $(dirname "${0}")/../..
ARGS=""
if [ "${1}" == "--debug" ]; then
  ARGS="--timeout 0 --debug-brk=9091"
fi
runTestsPostgres
