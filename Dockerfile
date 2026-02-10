# Build frontend assets
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY resources/ resources/
COPY public/ public/
COPY jsconfig.json postcss.config.js tailwind.config.js vite.config.js ./
RUN npm run build

# Laravel app with Nginx + PHP-FPM for proper cache headers on static assets
FROM php:8.2-fpm
RUN apt-get update && apt-get install -y \
    nginx git unzip libzip-dev libpng-dev libonig-dev libicu-dev gettext-base \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath intl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV PATH="${PATH}:/var/www/vendor/bin"

WORKDIR /var/www
COPY . .
COPY --from=frontend /app/public/build ./public/build

RUN composer install --no-dev --optimize-autoloader --no-interaction \
    && chown -R www-data:www-data storage bootstrap/cache database public \
    && chmod -R 775 storage bootstrap/cache database \
    && chmod +x /var/www/railway/start.sh \
    && mkdir -p /etc/nginx/conf.d

COPY nginx.conf.template /etc/nginx/templates/

EXPOSE 8000
# Railway sets PORT at runtime
CMD ["/var/www/railway/start.sh"]
