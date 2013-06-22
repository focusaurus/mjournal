#!/bin/sh
psql -c 'drop role mjournal;' postgres
psql -c 'create role mjournal login;' postgres
