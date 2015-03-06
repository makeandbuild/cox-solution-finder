#!/bin/bash

DTS=$( date +'%Y%m%d%H%M%S' )

rm -rf tmp/public

cp -RP public/ tmp/public/
rm tmp/public/uploads

node script/staticize.js

tar -C tmp/ -cf public/uploads/showroom-$DTS.tar public/

tar -tvf public/uploads/showroom-$DTS.tar | \
    sed -r 's/^.+\s+([0-9]+) .+ [0-9]{2}\:[0-9]{2} (.+)$/\2 \1/' | \
    sort | \
    openssl md5 -r | \
    cut -d ' ' -f1 >public/uploads/showroom-$DTS.tar.md5

mv -f public/uploads/showroom-$DTS.tar public/uploads/showroom.tar
mv -f public/uploads/showroom-$DTS.tar.md5 public/uploads/showroom.tar.md5

rm -rf tmp/public
