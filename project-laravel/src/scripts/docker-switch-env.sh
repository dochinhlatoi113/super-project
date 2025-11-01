#!/bin/bash

##############################################################################
# Docker Environment Switcher Script
# Usage: ./docker-switch-env.sh [local|prod|production]
##############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ENV_TYPE=$1
CONTAINER_NAME="laravel_php"  # Change this if your container name is different

# Function to display usage
show_usage() {
    echo -e "${YELLOW}Usage:${NC}"
    echo "  ./docker-switch-env.sh [local|prod|production]"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./docker-switch-env.sh local       # Switch to local environment"
    echo "  ./docker-switch-env.sh prod        # Switch to production environment"
    echo ""
}

# Function to check if container is running
check_container() {
    if ! docker ps | grep -q "$CONTAINER_NAME"; then
        echo -e "${RED}✗ Error:${NC} Container $CONTAINER_NAME is not running!"
        echo "Please start your Docker containers first."
        exit 1
    fi
}

# Function to switch environment in Docker
switch_docker_environment() {
    local env_file=$1
    local env_name=$2
    local backup_suffix=$3
    
    echo -e "${YELLOW}Switching to ${env_name} environment in Docker container...${NC}"
    
    # Check if env file exists
    docker exec $CONTAINER_NAME bash -c "if [ ! -f env-main/${env_file} ]; then echo 'NOT_FOUND'; fi" | grep -q "NOT_FOUND" && {
        echo -e "${RED}✗ Error:${NC} env-main/${env_file} not found in container!"
        exit 1
    }
    
    # Backup current .env to specific backup file
    docker exec $CONTAINER_NAME bash -c "
        cd /var/www/html
        if [ -f .env ]; then
            cp .env .env.backup.${backup_suffix}
            echo 'Backed up current .env to .env.backup.${backup_suffix}'
        fi
    "
    
    # Remove symlink and copy new environment file
    docker exec $CONTAINER_NAME bash -c "
        cd /var/www/html
        rm -f .env
        cp env-main/${env_file} .env
        echo 'Copied env-main/${env_file} to .env'
    "
    
    echo -e "${GREEN}✓${NC} Switched to ${env_name} environment in container"
    
    # Show current environment info
    echo ""
    echo -e "${YELLOW}Current Environment Settings:${NC}"
    docker exec $CONTAINER_NAME bash -c "cd /var/www/html && grep 'APP_ENV=' .env && grep 'APP_DEBUG=' .env && grep 'APP_URL=' .env && grep 'DB_HOST=' .env"
    
    # Clear Laravel caches
    echo ""
    echo -e "${YELLOW}Clearing Laravel caches in container...${NC}"
    docker exec $CONTAINER_NAME bash -c "
        cd /var/www/html
        php artisan config:clear 2>/dev/null
        php artisan cache:clear 2>/dev/null
        php artisan route:clear 2>/dev/null
        php artisan view:clear 2>/dev/null
    "
    echo -e "${GREEN}✓${NC} Caches cleared"
    
    echo ""
    echo -e "${GREEN}✓ Environment switched successfully in Docker!${NC}"
}

# Main logic
check_container

case "$ENV_TYPE" in
    "local")
        switch_docker_environment ".env.local" "LOCAL" "local"
        ;;
    "prod"|"production")
        switch_docker_environment ".env.prod" "PRODUCTION" "prod"
        ;;
    "")
        echo -e "${RED}✗ Error:${NC} Environment type is required!"
        echo ""
        show_usage
        exit 1
        ;;
    *)
        echo -e "${RED}✗ Error:${NC} Invalid environment type: ${ENV_TYPE}"
        echo ""
        show_usage
        exit 1
        ;;
esac
