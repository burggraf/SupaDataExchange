ionic build --prod
docker build . -t burggraf/postgres-data-import:latest
docker push burggraf/postgres-data-import:latest
