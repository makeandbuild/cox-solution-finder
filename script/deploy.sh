#!/bin/bash

function usage () {
  cat <<EOF
Usage: $PROGNAME ENVIRONMENT
Deploys the application to the given ENVIRONMENT
  ENVIRONMENT   dev|staging|maps
EOF
  exit $( [ $# -ne 0 ] && echo $1 || echo 0 )
}

[ -z "$1" ] && usage 1

APP_NAME="sfv2"
ENVIRONMENT="$1" && shift 1 && [ "$1" ] && usage 1
TARGET_HOST="$ENVIRONMENT.sfv2.cox.mxmcloud.com"
APP_ROOT="/srv/$APP_NAME"
[ "$ENVIRONMENT" == "maps" ] && APP_ROOT="$APP_ROOT-maps"

run() {
  cmd=""
  for arg in "$@" ; do
    cmd="$cmd $arg"
  done
  echo ">$cmd"
  cmd="sh -c 'cd $APP_ROOT ; $cmd'"
  ssh $APP_NAME@$TARGET_HOST "$cmd"
}

notify_slack() {
  curl -sS --data-binary @- \
      -H 'Content-Type: application/json' \
      -H 'Accept: application/json' \
      -XPOST https://hooks.slack.com/services/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 <<EOJSON
{ "channel": "#cox-solution-finder", "text": "$@" }
EOJSON
}

###
# Create release
rel_tag=` git tag --points-at=HEAD `
[ -z $rel_tag ] && rel_tag=` git rev-parse --short HEAD `
git ls-files -z | xargs -0 tar -czf tmp/release-$rel_tag.tar.gz

echo "Release: tmp/release-$rel_tag.gz"

notify_slack "Starting deployment: $rel_tag to $ENVIRONMENT"

###
# Upload release
run mkdir releases/$rel_tag
scp tmp/release-$rel_tag.tar.gz $APP_NAME@$TARGET_HOST:$APP_ROOT/releases/$rel_tag/archive.tar.gz
run tar -C releases/$rel_tag -xf releases/$rel_tag/archive.tar.gz
run rm releases/$rel_tag/archive.tar.gz

###
# Setup links
run rm -R releases/$rel_tag/log releases/$rel_tag/tmp releases/$rel_tag/public/uploads
run ln -s $APP_ROOT/shared/log releases/$rel_tag/log
run ln -s $APP_ROOT/shared/tmp releases/$rel_tag/tmp
run ln -s $APP_ROOT/shared/system/uploads releases/$rel_tag/public/uploads
run ln -s $APP_ROOT/shared/config/.env releases/$rel_tag/.env

###
# NPM install
run "cd releases/$rel_tag ; npm install"

###
# Change current
run rm current
run ln -s $APP_ROOT/releases/$rel_tag current

###
# Restart
run touch current/tmp/restart.txt

notify_slack "Finished deployment: $rel_tag to $ENVIRONMENT"
