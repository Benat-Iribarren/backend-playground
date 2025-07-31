# Makefile for Sequra Backend

# Variables
DOCKER_COMPOSE = docker-compose
DOCKER = docker

# Detect OS for cross-platform compatibility
ifeq ($(OS),Windows_NT)
    # Windows
    SHELL := cmd
    SLEEP := timeout /T
    READ := set /p
    VOLUME_NAME := sequra-backend-sm_sqlite_data
else
    # Unix-like systems (Linux, macOS)
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
.PHONY: db-init
db-init: ## Create tables and execute seeders
	@echo "Inicializando base de datos..."
	$(DOCKER_COMPOSE) exec backend sh -c "npx ts-node src/infrastructure/database/initDatabase.ts"

.PHONY: up
up: ## Start production/development services
	@echo "Starting backend and db services..."
	$(DOCKER_COMPOSE) up -d backend db

.PHONY: up-test
up-test: ## Start test services
	@echo "Starting test-runner and test-db services..."
	$(DOCKER_COMPOSE) up -d test-runner test-db

.PHONY: down
down: ## Stop all services
	@echo "Stopping services..."
	$(DOCKER_COMPOSE) down

.PHONY: logs
logs: ## Show logs from all services
	$(DOCKER_COMPOSE) logs -f

.PHONY: shell
shell: ## Open shell in backend container
	$(DOCKER_COMPOSE) exec backend sh

.PHONY: build
build: ## Build Docker images
	@echo "Building Docker images..."
	$(DOCKER_COMPOSE) build

.PHONY: clean
clean: ## Remove containers, networks, and volumes
	@echo "Cleaning up Docker resources..."
	$(DOCKER_COMPOSE) down -v --remove-orphans

# Open a persistent shell in the test-runner container (for test environment debugging)
.PHONY: test-shell
test-shell: ## Open shell in test-runner container
	$(DOCKER_COMPOSE) run --rm --service-ports test-runner sh

.PHONY: test-docker
test-docker: ## Run tests in Docker with ephemeral test DB
	$(DOCKER_COMPOSE) run --rm test-runner

.PHONY: test
test: up-test test-docker ## Run full test suite with DB
