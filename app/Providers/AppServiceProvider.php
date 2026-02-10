<?php

namespace App\Providers;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force MySQL when MySQL env vars are present (Railway); overrides any cached config
        if ($this->app->environment('production') && env('DB_HOST')) {
            Config::set('database.default', 'mysql');
        }

        // Force HTTPS in production so asset and app URLs use https (fixes mixed content behind Railway/proxy)
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        Vite::prefetch(concurrency: 3);
    }
}
