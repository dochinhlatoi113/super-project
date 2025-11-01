# Laravel Dev Stack (local)

This repository contains a Laravel application and local Docker-based development stack (MySQL, Elasticsearch, Kibana, Logstash, Kafka, Redis, php-fpm, nginx).

## Quick start

1. Copy `.env` (if provided) to `src/.env` and adjust credentials.
2. Start services:

```bash
docker compose -f docker-main/docker-compose.yml up -d --build
```

3. Enter PHP container:

```bash
docker exec -it laravel_php bash
cd /var/www/html
```

## Notes

-   See `.github/COPILOT_CONTEXT.md` for Copilot/assistant guidance in Vietnamese.
