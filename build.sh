ionic build --prod
docker build . -t burggraf/supa-data-exchange:latest
docker push burggraf/supa-data-exchange:latest
