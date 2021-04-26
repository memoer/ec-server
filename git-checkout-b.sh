#!/bin/sh
read -n1 -p "Select Branch Name( [1]feat [2]fix [3]refactor [4]test [5]chore ) >> " branchName
echo ""
case ${branchName} in
  1) branchName="feat" ;;
  2) branchName="fix" ;;
  3) branchName="refactor" ;;
  4) branchName="test" ;;
  5) branchName="chore" ;;
  *)
    echo "first argument must be one of feat, fix, refactor, test, chore"
    exit 1
    ;;
esac

desc=""
read -n1 -p "Related Issue Number: " issueNumber
echo ""
if [[ ${issueNumber} =~ ^[0-9]+$ ]]; then
  desc="/#${issueNumber}"
fi
  


read -p "content: " content
if ! [ -z "$content" ]; then
  desc="${desc}/${content}"
fi

git checkout -b ${branchName}${desc}