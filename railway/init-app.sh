#!/bin/bash
# Run before each deploy (migrations + cache). Used if you set Pre-Deploy to:
#   chmod +x ./railway/init-app.sh && ./railway/init-app.sh
# With Dockerfile + railway.toml, releaseCommand handles this; this script is for Nixpacks or custom flows.
set -e
php artisan migrate --force
php artisan optimize:clear
php artisan config:cache
php artisan event:cache
php artisan route:cache
php artisan view:cache
