mkdir -p ./tar
for dir in ./png/*/
do
  dir=${dir%*/}       # Remove trailing /
  dirname=${dir##*/}  # Remove path before directory name
  echo "\n$dirname"
  tar -czv -f ./tar/${dirname}.tar.gz -C ${dir} .
done
