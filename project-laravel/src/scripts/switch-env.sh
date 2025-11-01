#!/bin/bash

##############################################################################
# Environment Switcher Script
# Usage: ./switch-env.sh [local|prod|production]
##############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ENV_TYPE=$1

# Function to display usage
show_usage() {
    echo -e "${YELLOW}Usage:${NC}"
    echo "  ./switch-env.sh [local|prod|production]"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./switch-env.sh local       # Switch to local environment"
    echo "  ./switch-env.sh prod        # Switch to production environment"
    echo "  ./switch-env.sh production  # Switch to production environment"
    echo ""
}

# Function to backup current .env
backup_env() {
    if [ -f .env ]; then
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        cp .env ".env.backup_${TIMESTAMP}"
        echo -e "${GREEN}✓${NC} Backed up current .env to .env.backup_${TIMESTAMP}"
    fi
}

# Function to switch environment
switch_environment() {
    local env_file=$1
    local env_name=$2
    
    if [ ! -f "env-main/${env_file}" ]; then
        echo -e "${RED}✗ Error:${NC} env-main/${env_file} not found!"
        exit 1
    fi
    
    # Backup current .env
    backup_env
    
    # Copy new environment file
    cp "env-main/${env_file}" .env
    echo -e "${GREEN}✓${NC} Switched to ${env_name} environment"
    echo -e "${GREEN}✓${NC} Using env-main/${env_file}"
    
    # Show current environment info
    echo ""
    echo -e "${YELLOW}Current Environment Settings:${NC}"
    grep "APP_ENV=" .env
    grep "APP_DEBUG=" .env
    grep "APP_URL=" .env
    grep "DB_HOST=" .env
    
    # Clear Laravel caches
    echo ""
    echo -e "${YELLOW}Clearing Laravel caches...${NC}"
    php artisan config:clear 2>/dev/null
    php artisan cache:clear 2>/dev/null
    php artisan route:clear 2>/dev/null
    php artisan view:clear 2>/dev/null
    echo -e "${GREEN}✓${NC} Caches cleared"
    
    echo ""
    echo -e "${GREEN}✓ Environment switched successfully!${NC}"
}

# Main logic
case "$ENV_TYPE" in
    "local")
        switch_environment ".env.local" "LOCAL"
        ;;
    "prod"|"production")
        switch_environment ".env.prod" "PRODUCTION"
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
