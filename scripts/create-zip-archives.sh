mkdir -p ./zip
for dir in ./png/*/
do
  dir=${dir%*/}       # Remove trailing /
  dirname=${dir##*/}  # Remove path before directory name
  echo "\n$dirname"
  zip -rj ./zip/${dirname}.zip ${dir}/*
done
