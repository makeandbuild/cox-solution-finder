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
# Initial setup
run mkdir -p releases shared/tmp shared/log shared/config shared/system/uploads
run touch shared/config/.env
run chmod 0600 shared/config/.env

###
# Empty release
run mkdir -p releases/v0.0.0/public
run 'echo "Hello world" > releases/v0.0.0/public/index.html'
run ln -s $APP_ROOT/releases/v0.0.0 current
