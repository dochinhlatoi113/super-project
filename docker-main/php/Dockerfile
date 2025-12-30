FROM php:8.2-fpm

# Arguments
ARG INSTALL_LARAVEL=true

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    libpq-dev \
    libssl-dev \
    pkg-config \
    autoconf \
    g++ \
    make \
    vim \
    wget \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libmcrypt-dev \
    supervisor \
    libicu-dev \
    libcurl4-openssl-dev \
    librdkafka-dev   # 

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    intl \
    opcache \
    sockets \
    curl

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Swoole extension
RUN pecl install swoole && docker-php-ext-enable swoole

# 🟢 Install Kafka extension (rdkafka)
RUN pecl install rdkafka \
    && docker-php-ext-enable rdkafka

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Install Laravel if argument is true
RUN if [ "$INSTALL_LARAVEL" = "true" ]; then \
    composer create-project laravel/laravel . --prefer-dist --no-dev && \
    composer require predis/predis && \
    composer require laravel/octane && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache; \
    fi

# Create required directories and set permissions
RUN mkdir -p /var/www/html/storage/framework/{sessions,views,cache} \
    && mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/bootstrap/cache

# Copy existing application directory permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

RUN mkdir -p /var/log/supervisor \
    && chmod -R 777 /var/log/supervisor

 # 🟢 Increase PHP memory limit (avoid 134217728 bytes exhausted)
RUN echo "memory_limit = -1" > /usr/local/etc/php/conf.d/memory-limit.ini

# Expose port 8000 for Laravel server
EXPOSE 8000

# Start Laravel server
CMD ["php-fpm"]