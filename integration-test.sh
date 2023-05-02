echo -e "\033[31;7m Start the Backend and start the integration test... \e[0m";
docker-compose -f dev.docker-compose.yml --profile tests build
docker-compose -f dev.docker-compose.yml  --profile tests up