#!/bin/bash
# List all directories and convert them into a JavaScript array
dirs=$(ls -d */)
array="["
for dir in $dirs; do
  array+="\"${dir%/}\","
done
# Remove the trailing comma and close the array
array="${array%,}]"
echo "const test = $array"
