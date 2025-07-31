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

# Colors for output (with fallback for Windows)
ifeq ($(OS),Windows_NT)
    # Windows - use simple text without colors
    GREEN := 
    YELLOW := 
    RED := 
    NC := 
else
    # Unix-like systems - use ANSI colors
    GREEN := \033[0;32m
    YELLOW := \033[1;33m
    RED := \033[0;31m
    NC := \033[0m
endif

# Default target
.DEFAULT_GOAL := help

# Help target
.PHONY: help
help: ## Show this help message
	@echo "$(GREEN)Available commands:$(NC)"
ifeq ($(OS),Windows_NT)
	@powershell -Command "Get-Content $(MAKEFILE_LIST) | Select-String '^[a-zA-Z_-]+:.*?##' | ForEach-Object { $$line = $$_.Line; if ($$line -match '^([a-zA-Z_-]+):.*?## (.+)') { Write-Host ('  ' + $$matches[1].PadRight(20) + ' ' + $$matches[2]) } }"
else
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
endif

# Docker commands
.PHONY: up
up: ## Start all services
	@echo "$(GREEN)Starting services...$(NC)"
	$(DOCKER_COMPOSE) up -d

.PHONY: down
down: ## Stop all services
	@echo "$(GREEN)Stopping services...$(NC)"
	$(DOCKER_COMPOSE) down

.PHONY: logs
logs: ## Show logs from all services
	$(DOCKER_COMPOSE) logs -f

.PHONY: shell
shell: ## Open shell in backend container
	$(DOCKER_COMPOSE) exec backend sh

.PHONY: build
build: ## Build Docker images
	@echo "$(GREEN)Building Docker images...$(NC)"
	$(DOCKER_COMPOSE) build

.PHONY: clean
clean: ## Remove containers, networks, and volumes
	@echo "$(GREEN)Cleaning up Docker resources...$(NC)"
	$(DOCKER_COMPOSE) down -v --remove-orphans

# Database commands
.PHONY: db-create
db-create: ## Create database tables
	@echo "$(GREEN)Creating database tables...$(NC)"
	$(DOCKER_COMPOSE) exec backend node -e "require('./dist/infrastructure/database/createTables.js')"

.PHONY: db-reset
db-reset: ## Reset database (remove data volume)
	@echo "$(RED)WARNING: This will delete all data!$(NC)"
ifeq ($(OS),Windows_NT)
	@echo "Are you sure? [y/N]"
	@set /p CONFIRM=
	@if /i "!CONFIRM!"=="y" ( \
		$(DOCKER_COMPOSE) down -v && \
		$(DOCKER) volume rm $(VOLUME_NAME) 2>nul || echo. && \
		echo "$(GREEN)Database reset complete$(NC)" \
	) else ( \
		echo "$(YELLOW)Database reset cancelled$(NC)" \
	)
else
	@$(READ) -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(DOCKER_COMPOSE) down -v; \
		$(DOCKER) volume rm $(VOLUME_NAME) 2>/dev/null || true; \
		echo "$(GREEN)Database reset complete$(NC)"; \
	else \
		echo "$(YELLOW)Database reset cancelled$(NC)"; \
	fi
endif

# Setup commands
.PHONY: dev-setup
dev-setup: ## Development setup: start services and create database
	@echo "$(GREEN)Setting up development environment...$(NC)"
	$(MAKE) up
	@echo "$(GREEN)Waiting for services to start...$(NC)"
ifeq ($(OS),Windows_NT)
	@$(SLEEP) 5
else
	@$(SLEEP) 5
endif
	$(MAKE) db-create 