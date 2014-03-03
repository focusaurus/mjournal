#!/bin/bash
set -e
for DB in mjournal mjournal-test
do
  psql --username=mjournal --file="$1" "${DB}"
done
