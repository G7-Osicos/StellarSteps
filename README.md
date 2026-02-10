<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## Stellar Steps (Laravel + Inertia React)

This folder is the **Option B** stack for Stellar Steps: **Laravel (backend) + Inertia (React) + Tailwind (frontend)**.

### Run locally (XAMPP-friendly)

From `c:\xampp\htdocs\project-stellar-steps\stellar-steps-laravel`:

- Install dependencies (already done by the scaffold, rerun if needed):
  - `composer install`
  - `npm install`
- Start the dev servers:
  - `php artisan serve`
  - `npm run dev`

Then open the URL shown by `php artisan serve` (usually `http://127.0.0.1:8000`).

### Using MySQL (recommended with XAMPP)

By default, this scaffold may use SQLite for convenience. For XAMPP MySQL, update your `.env`:

- `DB_CONNECTION=mysql`
- `DB_HOST=127.0.0.1`
- `DB_PORT=3306`
- `DB_DATABASE=stellar_steps`
- `DB_USERNAME=root`
- `DB_PASSWORD=`

Then run:

- `php artisan migrate`

### Faster first-screen load (Welcome / Start)

The Welcome and Start pages show **"TAP TO OPEN"** and a warm background color **immediately**; the book and title images fade in when loaded. For even faster load, compress the first-screen assets (they are large):

- **`public/assets/img/title.png`** (~6 MB) – compress with [Squoosh](https://squoosh.app) or [TinyPNG](https://tinypng.com); aim for &lt;500 KB.
- **`public/assets/img/Book.png`** (~2.6 MB) – same; aim for &lt;400 KB.
- **`public/assets/img/LP_BG.jpg`** (~1.8 MB) – reduce quality or dimensions; aim for &lt;400 KB.

Replace the originals in `public/assets/img/` with the compressed versions and redeploy.

### Deploy on Railway

The app is set up for [Railway](https://railway.app) with a Dockerfile and `railway.toml`.

1. **Create a project** at [railway.com/new](https://railway.com/new) and choose **Deploy from GitHub repo**. Select **mejewuxsz/stellar-steps-laravel** (or your fork). No root directory change needed — the repo root is the Laravel app.
2. **Variables** (service **Settings** → **Variables**). Add at least:
   - `APP_KEY` — run locally: `php artisan key:generate --show` and paste the value.
   - `APP_ENV` — `production`
   - `APP_DEBUG` — `false`
   - `APP_URL` — set this **after** step 3 (e.g. `https://your-app.up.railway.app`).
   - **Optional (recommended for production):** `LOG_CHANNEL=stderr`, `LOG_STDERR_FORMATTER=\Monolog\Formatter\JsonFormatter`
3. **Generate a domain**: **Settings** → **Networking** → **Generate Domain**. Copy the URL and set `APP_URL` in Variables to that URL (with `https://`).
4. **Database (choose one):**
   - **SQLite (quick):** Leave default. Data is ephemeral (resets on redeploy). Good for a quick live demo.
   - **MySQL (persistent):** See [Add MySQL on Railway](#add-mysql-on-railway) below.
5. **Deploy:** Railway builds from the Dockerfile and runs migrations before each deploy via `railway.toml`. After the first successful deploy, set `APP_URL` to your generated domain and redeploy if needed.

#### Add MySQL on Railway

1. In your Railway project, click **+ New** → **Database** → **MySQL**. Railway will create a MySQL service and expose its connection variables.
2. Click your **web service** (the Laravel app), then **Settings** → **Variables**.
3. Add these variables (Railway will suggest linking; use the reference format so credentials stay in sync):

   | Variable        | Value (replace `MySQL` with your DB service name if different) |
   |-----------------|-----------------------------------------------------------------|
   | `DB_CONNECTION` | `mysql`                                                         |
   | `DB_HOST`       | `${{MySQL.MYSQLHOST}}`                                          |
   | `DB_PORT`       | `${{MySQL.MYSQLPORT}}`                                          |
   | `DB_DATABASE`   | `${{MySQL.MYSQLDATABASE}}`                                      |
   | `DB_USERNAME`   | `${{MySQL.MYSQLUSER}}`                                          |
   | `DB_PASSWORD`   | `${{MySQL.MYSQLPASSWORD}}`                                      |

4. Redeploy the web service. Migrations run automatically via `railway.toml` and will use the new MySQL database.

**If you get a 500 error:** The app uses the database for sessions and cache. Add **Variables**: `LOG_CHANNEL=stderr` and `LOG_LEVEL=debug`, then redeploy and check **Deploy Logs** for the exception. Often the cause is MySQL connection (wrong `DB_*` or reference name). To test without DB: set `SESSION_DRIVER=file` and `CACHE_STORE=file` temporarily; if the app loads, fix the MySQL variables and switch back to `database`.

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
