#!/bin/bash
cd docker-main

docker compose down 

# Build and start containers
docker compose up -d --build

# Check if Laravel is already installed inside the container
if ! docker exec laravel_php test -f /var/www/html/artisan; then
  echo "Installing fresh Laravel..."
  docker exec -it laravel_php bash -c "composer create-project laravel/laravel ."
else
  echo "✅ Laravel is already installed, skipping installation..."
fi

# Set permissions
docker exec -it laravel_php bash -c "chmod -R 775 storage bootstrap/cache && chown -R developer:root ."

echo "✅ Laravel environment is ready at http://localhost"