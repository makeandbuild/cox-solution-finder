#!/bin/bash

cp -RP public/ tmp/public/
rm tmp/public/uploads

node script/staticize.js

tar -C tmp/ -czf public/uploads/showroom.tar.gz public/

tar -tvf public/uploads/showroom.tar.gz | \
    sed -r 's/^.+\s+([0-9]+) [A-Z][a-z]{2}[0-9\:\ ]+ (.+)$/\2 \1/' | \
    sort |\
    openssl md5 -r |\
    cut -d ' ' -f1 > public/uploads/showroom.tar.gz.md5

rm -r tmp/public
