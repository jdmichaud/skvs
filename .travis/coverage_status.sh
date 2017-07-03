#!/bin/sh

echo "Starging coverage analysis"
if [[ $(npm run coverage-check) ]]
then
  echo "coverage OK"
  ./schk.sh skvs jdmichaud "success" "https://travis-ci.org/jdmichaud/skvs" "Code coverage ratio is within the specified limits" "continuous-integration/travis-ci"
else
  echo "coverage NOK"
  ./schk.sh skvs jdmichaud "success" "https://travis-ci.org/jdmichaud/skvs" "Code coverage ratio is within the specified limits" "continuous-integration/travis-ci"
fi
