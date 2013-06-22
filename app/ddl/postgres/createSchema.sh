#!/bin/sh
DIR=$(dirname "${0}")
for DB in mjournal mjournal-test
do
	psql --username=mjournal --file="${DIR}/createSchema.sql" "${DB}"
done
