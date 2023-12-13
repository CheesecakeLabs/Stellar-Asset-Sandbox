echo -e "\033[31;7m Start the Backend and start the integration test... \e[0m";
docker-compose -f dev.docker-compose.yml --profile starlabs build
docker-compose -f dev.docker-compose.yml --profile starlabs up -d
docker exec -it postgres psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='backend'" | grep -q 1 || docker exec -it postgres psql -U postgres -c "CREATE DATABASE backend;"
