# Railway MySQL Setup

The error `Connection refused (Host: 127.0.0.1, Port: 3306)` means your app is trying to connect to MySQL on localhost, but on Railway **MySQL runs as a separate service** with its own host. You must add MySQL and link it to your app.

## 1. Add MySQL to Your Project

1. In Railway Project Canvas, click **+ New** (or `Ctrl/Cmd + K`)
2. Select **Database** → **MySQL**
3. Wait for the MySQL service to deploy

## 2. Link MySQL to Your App Service

In your **App service** (stellarsteps), go to **Variables** and add these **references** (replace `MySQL` with your actual MySQL service name if different):

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

After redeploy, your app should connect to Railway’s MySQL host (e.g. `monorail.proxy.rlwy.net`) instead of `127.0.0.1`.
