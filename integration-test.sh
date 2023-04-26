echo -e "\033[31;7m Starting Kafka container and Starlabs container \e[0m";
docker-compose -f ./starlabs/docker-compose.yml --profile all build
docker-compose -f ./starlabs/docker-compose.yml --profile all up -d 

echo -e "\033[31;7m Waiting for Kafka to be ready... \e[0m";
docker exec broker cub kafka-ready -b localhost:29092 1 20

echo -e "\033[31;7m Start the KMS Service \e[0m";
docker-compose -f ./stellar-kms/docker-compose.yml --profile all build
docker-compose -f ./stellar-kms/docker-compose.yml --profile all up -d 

echo -e "\033[31;7m Start the integration test \e[0m";
docker-compose -f ./backend/docker-compose.yml up --build --abort-on-container-exit --exit-code-from integration

echo -e "\033[31;7m Stop the integration test \e[0m";
docker-compose -f ./starlabs/docker-compose.yml down
docker-compose -f ./stellar-kms/docker-compose.yml down
