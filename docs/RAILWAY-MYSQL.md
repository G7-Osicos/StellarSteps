# Railway MySQL Setup

The error `Connection refused (Host: 127.0.0.1, Port: 3306)` means your app is trying to connect to MySQL on localhost, but on Railway **MySQL runs as a separate service** with its own host. Variables are **not** shared automatically — you must add MySQL and explicitly reference its variables in your app.

## 1. Add MySQL to Your Project

1. In Railway Project Canvas, click **+ New** (or `Ctrl/Cmd + K`)
2. Select **Database** → **MySQL**
3. Wait for the MySQL service to deploy
4. **Note the MySQL service name** (e.g. `MySQL`) — you need it for references

## 2. Link MySQL to Your App Service

**Important:** If you have `DB_HOST=127.0.0.1` (e.g. from .env.example), **remove or replace it**. On Railway, that points to localhost inside your container, where MySQL is not running.

In your **App service** → **Variables**, add or update these **references**. Replace `MySQL` with your actual MySQL service name:

| Variable      | Value                    |
|---------------|--------------------------|
| `DB_CONNECTION` | `mysql`                |
| `DB_HOST`     | `${{MySQL.MYSQLHOST}}`   |
| `DB_PORT`     | `${{MySQL.MYSQLPORT}}`   |
| `DB_DATABASE` | `${{MySQL.MYSQLDATABASE}}` |
| `DB_USERNAME` | `${{MySQL.MYSQLUSER}}`   |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |

**Or** use the connection URL:

| Variable   | Value                |
|------------|----------------------|
| `DB_CONNECTION` | `mysql`          |
| `DB_URL`   | `${{MySQL.MYSQL_URL}}` |

## 3. Redeploy

Click **Deploy** to redeploy with the new variables. Migrations will run automatically.

## Verifying

After redeploy, your app should connect to Railway’s MySQL host (e.g. `monorail.proxy.rlwy.net`) Logs should show DB_HOST with the MySQL host. If you still see Connection refused, check variable names and service reference (case-sensitive).
