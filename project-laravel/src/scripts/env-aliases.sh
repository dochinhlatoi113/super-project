#!/bin/bash

##############################################################################
# Quick Environment Switcher Aliases
# Source this file in your .bashrc or .zshrc:
# source /path/to/project/env-aliases.sh
##############################################################################

PROJECT_ROOT="/Users/buimanhkhuong/Desktop/project"

# Function to switch environment
env-local() {
    echo "🔄 Switching to LOCAL environment..."
    cd "$PROJECT_ROOT" && ./docker-switch-env.sh local
}

env-prod() {
    echo "🔄 Switching to PRODUCTION environment..."
    cd "$PROJECT_ROOT" && ./docker-switch-env.sh prod
}

# Function to check current environment
env-check() {
    echo "📋 Current environment:"
    docker exec laravel_php bash -c "cd /var/www/html && cat .env | grep -E 'APP_ENV|APP_DEBUG|APP_URL|DB_HOST'"
}

# Function to backup current .env
env-backup() {
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    docker exec laravel_php bash -c "cd /var/www/html && cp .env .env.backup_${TIMESTAMP}"
    echo "✓ Backed up to .env.backup_${TIMESTAMP}"
}

# Function to list all env files
env-list() {
    echo "📁 Available environment files:"
    docker exec laravel_php bash -c "cd /var/www/html && ls -lh env-main/.env.*"
}

# Function to diff environments
env-diff() {
    echo "🔍 Differences between .env.local and .env.prod:"
    docker exec laravel_php bash -c "cd /var/www/html && diff env-main/.env.local env-main/.env.prod || true"
}

# Help function
env-help() {
    echo "🔧 Environment Switcher Commands:"
    echo ""
    echo "  env-local      - Switch to local environment"
    echo "  env-prod       - Switch to production environment"
    echo "  env-check      - Show current environment config"
    echo "  env-backup     - Backup current .env file"
    echo "  env-list       - List all available .env files"
    echo "  env-diff       - Show differences between local and prod"
    echo "  env-help       - Show this help message"
    echo ""
}

echo "✓ Environment switcher aliases loaded!"
echo "  Run 'env-help' for available commands"
