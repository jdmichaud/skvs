#!/bin/bash

echo "Starging coverage analysis"
if [[ $(npm run coverage-check) ]]
then
  echo "coverage OK"
  .travis/schk.sh skvs jdmichaud "success" "https://travis-ci.org/jdmichaud/skvs" "Code coverage ratio is within the specified limits" "continuous-integration/travis-ci"
else
  echo "coverage NOK"
  .travis/schk.sh skvs jdmichaud "success" "https://travis-ci.org/jdmichaud/skvs" "Code coverage ratio is within the specified limits" "continuous-integration/travis-ci"
fi
