1: clear cache redis
docker compose exec redis redis-cli FLUSHALL

2: run serve 
docker exec -it laravel_php php artisan serve --host=0.0.0.0 --port=8000

3: clear 
docker exec -it laravel_php php artisan optimize:clear


docker exec -it laravel_php 

