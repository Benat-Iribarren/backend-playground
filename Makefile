# Makefile for Sequra Backend

# Variables
DOCKER_COMPOSE = docker compose
DOCKER = docker

# Detect OS for cross-platform compatibility
ifeq ($(OS),Windows_NT)
    SHELL := cmd
    SLEEP := timeout /T
    READ := set /p
    VOLUME_NAME := sequra-backend-sm_sqlite_data
else
    SHELL := /bin/bash
    SLEEP := sleep
    READ := read
    VOLUME_NAME := sequra-backend-sm_sqlite_data
endif

# Default target
.DEFAULT_GOAL := help

# Help target
.PHONY: help
help: ## Show this help message
	@echo "Available commands:"
ifeq ($(OS),Windows_NT)
	@powershell -Command "Get-Content $(MAKEFILE_LIST) | Select-String '^[a-zA-Z_-]+:.*?##' | ForEach-Object { $$line = $$_.Line; if ($$line -match '^([a-zA-Z_-]+):.*?## (.+)') { Write-Host ('  ' + $$matches[1].PadRight(20) + ' ' + $$matches[2]) } }"
else
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'
endif

# Docker commands
.PHONY: up
up: ## Start production/development services
	@echo "Starting production services..."
	$(DOCKER_COMPOSE) --profile production up -d

.PHONY: test
test: ## Run test services (uses in-memory database and closes when tests finish)
	@echo "Running tests..."
ifeq ($(OS),Windows_NT)
	set NODE_ENV=test&& set BACKEND_PORT=3001&& set BACKEND_COMMAND=npm run test&& $(DOCKER_COMPOSE) --profile test up -d --build
else
	NODE_ENV=test BACKEND_PORT=3001 BACKEND_COMMAND="npm run test" $(DOCKER_COMPOSE) --profile test up -d --build
endif
	@echo "Executing tests..."
	-$(DOCKER_COMPOSE) --profile test exec -e NODE_ENV=test -e BACKEND_PORT=3001 -e BACKEND_COMMAND="npm run test" backend sh -c "npm ci && npm run build && npm run test"
	@echo "Cleaning up test containers..."
	$(DOCKER_COMPOSE) --profile test down

.PHONY: test-watch
test-watch: ## Run tests in watch mode (uses in-memory database, stays open)
	@echo "Running tests in watch mode..."
ifeq ($(OS),Windows_NT)
	set NODE_ENV=test&& set BACKEND_PORT=3001&& set BACKEND_COMMAND=npm run test:watch&& $(DOCKER_COMPOSE) --profile test up -d --build
else
	NODE_ENV=test BACKEND_PORT=3001 BACKEND_COMMAND="npm run test:watch" $(DOCKER_COMPOSE) --profile test up -d --build
endif
	$(DOCKER_COMPOSE) --profile test exec -e NODE_ENV=test -e BACKEND_PORT=3001 -e BACKEND_COMMAND="npm run test:watch" backend sh -c "npm ci && npm run build && npm run test:watch"

.PHONY: up-test
up-test: ## Start test services in background (server stays running for manual testing)
	@echo "Starting test services..."
ifeq ($(OS),Windows_NT)
	set NODE_ENV=test&& set BACKEND_PORT=3001&& set BACKEND_COMMAND=npm start&& $(DOCKER_COMPOSE) --profile test up -d --build
else
	NODE_ENV=test BACKEND_PORT=3001 BACKEND_COMMAND="npm start" $(DOCKER_COMPOSE) --profile test up -d --build
endif
	@echo "Waiting for services to start..."
	$(SLEEP) 5
	@echo "Services should be running. Check with 'make logs-test' if there are issues."

.PHONY: down-test
down-test: ## Stop test services
	@echo "Stopping test services..."
	$(DOCKER_COMPOSE) --profile test down

.PHONY: logs-test
logs-test: ## Show logs from test services
	$(DOCKER_COMPOSE) --profile test logs -f

.PHONY: db-init
db-init: 
	@echo "Initializing production database..."
	$(DOCKER_COMPOSE) --profile production exec -e NODE_ENV=development -e DATABASE_FILE_PATH=./data/sequraBackendDB.sqlite backend sh -c "npx ts-node src/common/infrastructure/database/initDatabase.ts" ## Initialize production database (alias)

.PHONY: db-init-test
db-init-test: ## Initialize test database (in-memory)
	@echo "Initializing test database..."
	$(DOCKER_COMPOSE) --profile test exec -e NODE_ENV=test backend sh -c "npx ts-node src/common/infrastructure/database/initTestDatabase.ts"

.PHONY: down
down: ## Stop all services
	@echo "Stopping services..."
	$(DOCKER_COMPOSE) down

.PHONY: logs
logs: ## Show logs from all services
	$(DOCKER_COMPOSE) logs -f

.PHONY: shell
shell: ## Open shell in backend container (production)
	$(DOCKER_COMPOSE) --profile production exec -e NODE_ENV=development -e DATABASE_FILE_PATH=./data/sequraBackendDB.sqlite backend sh

.PHONY: shell-test
shell-test: ## Open shell in backend container (test)
	$(DOCKER_COMPOSE) --profile test exec -e NODE_ENV=test -e BACKEND_PORT=3001 backend sh

.PHONY: build
build: ## Build Docker images
	@echo "Building Docker images..."
	$(DOCKER_COMPOSE) build

.PHONY: clean
clean: ## Remove containers, networks, and volumes
	@echo "Cleaning up Docker resources..."
	$(DOCKER_COMPOSE) down -v --remove-orphans