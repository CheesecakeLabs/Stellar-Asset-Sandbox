# Build and up targets for all profiles in development environment
dev-all: dev-all dev-up-all

dev-up-all:
	docker-compose -f dev.docker-compose.yml --profile all build
	docker-compose -f dev.docker-compose.yml --profile all up -d

dev-up-starlabs:
	docker-compose -f dev.docker-compose.yml --profile starlabs build
	docker-compose -f dev.docker-compose.yml --profile starlabs up -d

dev-up-tests:
	@echo "Building containers for tests..."
	@docker-compose -f dev.docker-compose.yml --profile tests build > /dev/null 2>&1 || (echo "Container build failed!" && exit 1)
	@echo "Starting containers for tests..."
	@docker-compose -f dev.docker-compose.yml --profile tests up -d > /dev/null 2>&1 || (echo "Starting containers failed!" && exit 1)
	@echo "Starting the integration test..."
	@docker-compose -f dev.docker-compose.yml logs -f integration
	@echo "Removing containers..."
	@docker-compose -f dev.docker-compose.yml down --remove-orphans > /dev/null 2>&1


dev-up-kafka:
	docker-compose -f dev.docker-compose.yml --profile kafka build
	docker-compose -f dev.docker-compose.yml --profile kafka up -d

dev-up-backend:
	docker-compose -f dev.docker-compose.yml --profile backend build
	docker-compose -f dev.docker-compose.yml --profile backend up -d

dev-up-frontend:
	docker-compose -f dev.docker-compose.yml --profile frontend build
	docker-compose -f dev.docker-compose.yml --profile frontend up -d

dev-stop:
	docker-compose -f dev.docker-compose.yml down --remove-orphans 

dev-destroy:
	docker-compose -f dev.docker-compose.yml down -v --remove-orphans 

.PHONY: dev-all dev-up-all dev-up-starlabs dev-up-tests dev-up-kafka dev-up-backend dev-up-frontend dev-stop dev-destroy
