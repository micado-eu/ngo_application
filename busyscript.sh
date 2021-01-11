#!/bin/sh
#set -x

# removing old files from volume
echo "removing old files from volume"
rm -rf /var/www/html/*
# showing that we removed the files
ls -lat /var/www/html/
echo "correct if only empty folder is shown"
echo "showing the content of the container image"
ls -lat /var/www/html2/
echo "copying the new files from the container image"
cp -ra /var/www/html2/* /var/www/html/ 
echo "showing the new content"
ls -lat /var/www/html/
echo "creating the file with the env content"
envsubst < /var/www/html/statics/config.tmpl.json > /var/www/html/statics/config.json
cat /var/www/html/statics/config.json

exit
