#!/bin/sh
# Start Nginx + PHP-FPM for Railway. Static assets get long cache headers for faster reloads.
set -e
php artisan config:clear 2>/dev/null || true
# Force MySQL for migrate so tables are created in Railway's DB (Railway uses MYSQLHOST, not DB_HOST)
export DB_CONNECTION=mysql

# Fail fast if MySQL is not correctly configured for Railway
DB_HOST_VAL="${DB_HOST:-${MYSQLHOST}}"
if [ -z "${DB_HOST_VAL}" ] || [ "${DB_HOST_VAL}" = "127.0.0.1" ] || [ "${DB_HOST_VAL}" = "localhost" ]; then
    echo ""
    echo "ERROR: MySQL not configured for Railway."
    echo "  DB_HOST=${DB_HOST_VAL:-'(not set)'}  <- must be Railway MySQL host (e.g. monorail.proxy.rlwy.net)"
    echo ""
    echo "You have DB_HOST=127.0.0.1 or similar. On Railway, MySQL is a separate service."
    echo ""
    echo "To fix: In App service -> Variables, SET or REPLACE these with references:"
    echo "  DB_HOST     = \${{MySQL.MYSQLHOST}}"
    echo "  DB_PORT     = \${{MySQL.MYSQLPORT}}"
    echo "  DB_DATABASE = \${{MySQL.MYSQLDATABASE}}"
    echo "  DB_USERNAME = \${{MySQL.MYSQLUSER}}"
    echo "  DB_PASSWORD = \${{MySQL.MYSQLPASSWORD}}"
    echo ""
    echo "  (Replace 'MySQL' with your MySQL service name. Remove any literal 127.0.0.1!)"
    echo ""
    echo "See docs/RAILWAY-MYSQL.md"
    exit 1
fi

echo "DB_HOST=${DB_HOST_VAL}"

# Laravel requires APP_KEY (set via: php artisan key:generate --show)
if [ -z "${APP_KEY}" ]; then
    echo ""
    echo "ERROR: APP_KEY is not set. Run 'php artisan key:generate --show' locally and add APP_KEY to Railway Variables."
    exit 1
fi

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

# Substitute PORT into nginx config (use conf.d - more reliably included than sites-enabled)
envsubst '${PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/railway.conf

# Start PHP-FPM in background, wait for it to be ready, then Nginx in foreground
php-fpm &
sleep 2
echo "Listening on 0.0.0.0:$PORT"
exec nginx -g "daemon off;"
