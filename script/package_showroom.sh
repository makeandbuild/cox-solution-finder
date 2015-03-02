#!/bin/bash

cp -RP public/ tmp/public/
rm -f tmp/public/showroom.tar.gz

node script/staticize.js

tar -C tmp/ -czf public/showroom.tar.gz public/

tar -tvf public/showroom.tar.gz | \
    sed -r 's/^.+\s+([0-9]+) [A-Z][a-z]{2}[0-9\:\ ]+ (.+)$/\2 \1/' | \
    sort |\
    openssl md5 -r |\
    cut -d ' ' -f1 > public/showroom.tar.gz.md5

rm -r tmp/public
