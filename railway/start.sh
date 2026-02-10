#!/bin/sh
# Start Laravel for Railway. Run migrations then serve (releaseCommand may not have DB).
set -e
php artisan config:clear 2>/dev/null || true
# Force MySQL for migrate so tables are created in Railway's DB (Railway uses MYSQLHOST, not DB_HOST)
export DB_CONNECTION=mysql
echo "Running migrations..."
php artisan migrate --force
echo "Starting server..."
# Railway injects PORT (e.g. 8080). Fallback for local runs.
PORT="${PORT:-${RAILWAY_TCP_PROXY_PORT:-8000}}"
export PORT
echo "Listening on 0.0.0.0:$PORT"
exec php artisan serve --host=0.0.0.0 --port="$PORT"
