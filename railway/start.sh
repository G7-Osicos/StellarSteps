#!/bin/sh
# Start Nginx + PHP-FPM for Railway. Static assets get long cache headers for faster reloads.
set -e
php artisan config:clear 2>/dev/null || true
# Force MySQL for migrate so tables are created in Railway's DB (Railway uses MYSQLHOST, not DB_HOST)
export DB_CONNECTION=mysql
echo "Running migrations..."
php artisan migrate --force
echo "Starting Nginx + PHP-FPM..."

# Railway injects PORT (e.g. 8080). Fallback for local runs.
PORT="${PORT:-${RAILWAY_TCP_PROXY_PORT:-8000}}"
export PORT

# Substitute PORT into nginx config
envsubst '${PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/sites-enabled/default

# Start PHP-FPM in background, then Nginx in foreground
php-fpm &
echo "Listening on 0.0.0.0:$PORT"
exec nginx -g "daemon off;"
