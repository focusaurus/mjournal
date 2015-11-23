#!/bin/bash

# begin git work to prepare for a build/test/release
# Usage: release-candidate.sh <patch|minor|major>"

cd "$(dirname "$0")/.."
source ./bin/lib/strict-mode.sh
if [[ $(git status --short | wc -c | tr -d " ") != "0" ]]; then
  echo "Abort: working directory not clean"
  exit 11
fi
echo "Creating a new release candidate"
git checkout develop
git pull origin develop
git pull origin master
npm version -m "Bump version for %s release" "$@"
