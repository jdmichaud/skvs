#!/bin/sh

if [[ $(npm run coverage-check) ]]
then
  curl -s \
    --request POST https://${GH_TOKEN}:x-oauth-basic@api.github.com/repos/jdmichaud/skvs/statuses/${TRAVIS_COMMIT} \
    --header "Content-Type: application/json" \
    --cookie /tmp/curl_cookies \
    --cookie-jar /tmp/curl_cookies \
    --data @- << EOF
{
  "state": "success",
  "target_url": "https://travis-ci.org/jdmichaud/skvs",
  "description": "Code coverage ratio is within the specified limits",
  "context": "continuous-integration/travis-ci"
}
EOF > /dev/null 2>&1
else
  curl -s \
    --request POST https://${GH_TOKEN}:x-oauth-basic@api.github.com/repos/jdmichaud/skvs/statuses/${TRAVIS_COMMIT} \
    --header "Content-Type: application/json" \
    --cookie /tmp/curl_cookies \
    --cookie-jar /tmp/curl_cookies \
    --data @- << EOF
{
  "state": "failure",
  "target_url": "https://travis-ci.org/jdmichaud/skvs",
  "description": "Code coverage ratio is below the specified limits",
  "context": "continuous-integration/travis-ci"
}
EOF > /dev/null 2>&1
fi

