#!/bin/sh
DIR=$(dirname "${0}")/../../app/db/postgres
for DB in mjournal mjournal-test
do
	psql --username=mjournal --file="${DIR}/dropSchema.sql" "${DB}"
done
