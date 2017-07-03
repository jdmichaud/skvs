#!/bin/bash

function usage() {
  echo "usage: schk <repo> <repo_owner> <status> <target_url> <decription> [context]"
}

if [[ $# -lt 5 || $# -gt 6 ]]
then
  usage
  exit 1
fi

if [ -z "$GH_TOKEN" ]
then
	echo "GH_TOKEN is unset. It needs to be set to your github.com API token"
fi

if [ -z "$TRAVIS_COMMIT" ]
then
	printf "TRAVIS_COMMIT is unset. It needs to be set to the COMMIT sha1 on "
	printf "which the status will be posted\n"
fi

repo=$1
repo_owner=$2
status=$3
target_url=$4
description=$5
context=$6

cookie_file=$(mktmp)

curl -s \
    --request POST https://${GH_TOKEN}:x-oauth-basic@api.github.com/repos/${repo_owner}/${repo}/statuses/${TRAVIS_COMMIT} \
    --header "Content-Type: application/json" \
    --cookie ${cookie_file} \
    --cookie-jar ${cookie_file} \
    --data @- > /dev/null << EOF
{
  "state": "$status",
  "target_url": "$target_url",
  "description": "$description",
  "context": "$context"
}
EOF
