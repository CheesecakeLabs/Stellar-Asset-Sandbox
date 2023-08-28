#!/bin/bash

PROFILE=$1

echo -e "\033[31;7m Start the $PROFILE \e[0m"

if [ "$PROFILE" == "tests" ]; then
    echo "Building containers for tests..."
    
    docker-compose -f dev.docker-compose.yml --profile $PROFILE build > /dev/null
    
    echo "Resetting the database for tests..."
    
    echo "Starting the integration test..."
    docker-compose -f dev.docker-compose.yml --profile $PROFILE up -d
    docker exec -it postgres psql -U postgres -c "DROP DATABASE backend  WITH (FORCE);" > /dev/null
    docker exec -it postgres psql -U postgres -c "CREATE DATABASE backend;" > /dev/null 
	docker-compose -f dev.docker-compose.yml logs -f integration
	
    echo "Removing containers..."
	docker-compose -f dev.docker-compose.yml stop --remove-orphans > /dev/null 2>&1
else
    docker-compose -f dev.docker-compose.yml --profile $PROFILE build
    docker-compose -f dev.docker-compose.yml --profile $PROFILE up -d
    docker exec -it postgres psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='backend'" | grep -q 1 || docker exec -it postgres psql -U postgres -c "CREATE DATABASE backend;"
fi
