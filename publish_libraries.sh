#!/bin/bash

# Parameters
# $1 is the commit message

function installAndUpdate(){
  local MICROSERVICE=${1}
  local uri=$(cat $MICROSERVICE/package.json | jq ".dependencies[\"@alphonse92/ms-lib\"]")
    
  if [ $uri != "null" ]; then
    echo " == > updating @alphonse92/ms-lib"
    cd $MICROSERVICE
    npm update @alphonse92/ms-lib
    cd ..
  fi

}

#Setting microservices folders
MICROSERVICES=(
  "./gateway"
  "./prerender"
)

## STARTING GIT TASK

  ## setting a default commit message
  COMMIT_MSG=${1}
  if [ -z "$COMMIT_MSG" ] ; then
    COMMIT_MSG="updating library"
  fi;
  cd ./microservice-lib
  git add ./microservice-lib
  git commit -m "$1"
  git push
  cd ..
## END GIT  TASK

# STARTING TO UPDATE NPM PACKAGES
for microservice in "${MICROSERVICES[@]}"; do ( echo && echo "updating common lib $microservice" &&  installAndUpdate "${microservice}" && echo ) done
# END OF UPDATE NPM PACKAGES