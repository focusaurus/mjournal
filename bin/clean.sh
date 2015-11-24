#!/bin/bash
cd "$(dirname "$0")/.."
source ./bin/lib/strict-mode.sh
ls Dockerfile wwwroot/*.js 2> /dev/null | gxargs --no-run-if-empty rm
