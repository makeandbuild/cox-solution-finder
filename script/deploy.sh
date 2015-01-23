#!/bin/bash

APP_NAME="sfv2"
TARGET_HOST='dev.sfv2.cox.mxmcloud.com'
APP_ROOT="/srv/$APP_NAME"

run() {
  cmd=""
  for arg in "$@" ; do
    cmd="$cmd $arg"
  done
  echo ">$cmd"
  cmd="sh -c 'cd $APP_ROOT ; $cmd'"
  ssh $APP_NAME@$TARGET_HOST "$cmd"
}

###
# Create release
rel_tag=` git tag --points-at=HEAD `
[ -z $rel_tag ] && rel_tag=` git rev-parse --short HEAD `
git ls-files -z | xargs -0 tar -czf tmp/release-$rel_tag.tar.gz

echo "Release: tmp/release-$rel_tag.gz"

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

###
# Change current
run rm current
run ln -s $APP_ROOT/releases/$rel_tag current

###
# Restart
run touch current/tmp/restart.txt
