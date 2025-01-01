#!/bin/sh
#cd ../..
cd /home/runner/win8-remix
echo -n '[' > apps/file-explorer/directory.json
find . -type d -not -path './.cache/*' -not -path './.config/*' -not -path './.replit' -not -path './replit.nix' | sed 's?./??' | while read -r file
do
if [ "$file" = ".config" ];then continue;fi
if [ "$file" = ".cache" ];then continue;fi
if [ "$file" = "." ];then continue;fi
echo -n "\"/$file\"," >> apps/file-explorer/directory.json
done
echo "]" >> apps/file-explorer/directory.json
sed -i 's/,]/]/' apps/file-explorer/directory.json

echo -n '[' > apps/file-explorer/file.json
find . -type f -not -path './.cache/*' -not -path './.config/*' -not -path './.replit' -not -path './replit.nix' | sed 's?./??' | while read -r file
do
if [ "$file" = "." ];then continue;fi
echo -n "\"/$file\"," >> apps/file-explorer/file.json
done
echo "]" >> apps/file-explorer/file.json
sed -i 's/,]/]/' apps/file-explorer/file.json