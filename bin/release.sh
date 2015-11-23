#!/bin/bash

# finalize a release in git

cd "$(dirname "$0")/.."
source ./bin/lib/strict-mode.sh
if [[ $(git status --short | wc -c | tr -d " ") != "0" ]]; then
  echo "Abort: working directory not clean"
  exit 11
fi
git checkout master
git merge develop
git push --tags origin master
