#!/bin/sh
# Start Nginx + PHP-FPM for Railway. Static assets get long cache headers for faster reloads.
set -e
php artisan config:clear 2>/dev/null || true
# Force MySQL for migrate so tables are created in Railway's DB (Railway uses MYSQLHOST, not DB_HOST)
export DB_CONNECTION=mysql
echo "Running migrations..."
# Retry migrations (Railway MySQL may not be ready yet on cold start)
for i in 1 2 3 4 5 6 7 8 9 10; do
    if php artisan migrate --force; then
        echo "Migrations completed."
        break
    fi
    if [ $i -eq 10 ]; then
        echo ""
        echo "Migrations failed after 10 attempts."
        echo "Ensure MySQL is added and linked. See docs/RAILWAY-MYSQL.md"
        exit 1
    fi
    echo "MySQL not ready, retrying in 3s ($i/10)..."
    sleep 3
done
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
