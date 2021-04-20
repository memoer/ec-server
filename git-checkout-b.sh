#!/bin/sh
if [ ${1} != "feat" -a ${1} != "fix" -a ${1} != "docs" -a ${1} != "refactor" -a ${1} != "test" -a ${1} != "chore" ]; then
  echo "first argument must be one of feat, fix, docs, refactor, test, chore"
  exit 1
elif ! [[ "$2" =~ ^[0-9]+$ ]]; then
  echo "second argument must be number type"
  exit 1
else
  git checkout -b ${1}/\#${2}
fi
