#!/bin/sh
read -n1 -p "Select Branch Name( [1]feat [2]fix [3]docs [4]refactor [5]test [6]chore ) >> " branchName
echo ""
case ${branchName} in
  1) branchName="feat" ;;
  2) branchName="fix" ;;
  3) branchName="docs" ;;
  4) branchName="refactor" ;;
  5) branchName="test" ;;
  6) branchName="chore" ;;
  *)
    echo "first argument must be one of feat, fix, docs, refactor, test, chore"
    exit 1
    ;;
esac

read -n1 -p "Related Issue Number: " issueNumber
echo ""
if ! [[ ${issueNumber} =~ ^[0-9]+$ ]]; then
  echo "related issue number must be number type"
  exit 1
fi

read -p "content: " content
if ! [ -z "$content" ]; then
  content="/${content}"
fi

git checkout -b ${branchName}/\#${issueNumber}${content}