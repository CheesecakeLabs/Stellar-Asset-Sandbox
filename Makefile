# Build and up targets for all profiles in development environment
dev-all: dev-up-all

dev-up-all:
	@./dev-env.sh all

dev-up-starlabs:
	@./dev-env.sh starlabs

dev-up-tests:
	@./dev-env.sh tests

dev-up-kafka:
	@./dev-env.sh kafka

dev-up-backend:
	@./dev-env.sh backend

dev-up-frontend:
	@./dev-env.sh frontend

dev-stop:
	docker-compose -f dev.docker-compose.yml down --remove-orphans 

dev-destroy:
	docker-compose -f dev.docker-compose.yml down -v --remove-orphans 

.PHONY: dev-all dev-up-all dev-up-starlabs dev-up-tests dev-up-kafka dev-up-backend dev-up-frontend dev-stop dev-destroy
