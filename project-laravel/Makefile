.PHONY: env-local env-prod env-check env-backup env-list env-diff help

##############################################################################
# Environment Management Commands
# Usage: make env-local, make env-prod, etc.
##############################################################################

# Switch to local environment
env-local:
	@echo "🔄 Switching to LOCAL environment..."
	@./scripts/docker-switch-env.sh local

# Switch to production environment  
env-prod:
	@echo "🔄 Switching to PRODUCTION environment..."
	@./scripts/docker-switch-env.sh prod

# Check current environment
env-check:
	@echo "📋 Current environment:"
	@docker exec laravel_php bash -c "cd /var/www/html && cat .env | grep -E 'APP_ENV|APP_DEBUG|APP_URL|DB_HOST'"

# Backup current .env
env-backup:
	@TIMESTAMP=$$(date +%Y%m%d_%H%M%S); \
	docker exec laravel_php bash -c "cd /var/www/html && cp .env .env.backup_$$TIMESTAMP"; \
	echo "✓ Backed up to .env.backup_$$TIMESTAMP"

# List available .env files
env-list:
	@echo "📁 Available environment files:"
	@docker exec laravel_php bash -c "cd /var/www/html && ls -lh env-main/.env.*"

# Show differences between environments
env-diff:
	@echo "🔍 Differences between .env.local and .env.prod:"
	@docker exec laravel_php bash -c "cd /var/www/html && diff env-main/.env.local env-main/.env.prod || true"

# Clear all Laravel caches
cache-clear:
	@echo "🧹 Clearing Laravel caches..."
	@docker exec laravel_php bash -c "cd /var/www/html && php artisan optimize:clear"
	@echo "✓ Caches cleared"

# Show help
help:
	@echo "🔧 Available Commands:"
	@echo ""
	@echo "  make env-local     - Switch to local environment"
	@echo "  make env-prod      - Switch to production environment"
	@echo "  make env-check     - Show current environment config"
	@echo "  make env-backup    - Backup current .env file"
	@echo "  make env-list      - List all available .env files"
	@echo "  make env-diff      - Show differences between local and prod"
	@echo "  make cache-clear   - Clear all Laravel caches"
	@echo "  make help          - Show this help message"
	@echo ""
