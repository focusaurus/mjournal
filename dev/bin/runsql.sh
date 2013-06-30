#!/bin/sh
#This script is designed to have many symlinks with different names
# the .sh symlinks should map to a corresponding .sql file
DIR=$(dirname "${0}")/../../app/db/postgres
BASE=$(basename "${0}" | cut -d . -f 1)
for DB in mjournal mjournal-test
do
	psql --username=mjournal --file="${DIR}/${BASE}.sql" "${DB}"
done
