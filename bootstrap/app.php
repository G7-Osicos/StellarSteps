<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');

        // Apply image cache headers early for all web requests
        $middleware->web(prepend: [
            \App\Http\Middleware\ImageCacheHeaders::class,
        ]);

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Log full exception to stderr in production so Railway deploy logs show the real error
        $exceptions->reportable(function (\Throwable $e) {
            if (app()->environment('production')) {
                $msg = $e->getMessage() . "\n" . $e->getFile() . ':' . $e->getLine() . "\n" . $e->getTraceAsString();
                @file_put_contents('php://stderr', "[Stellar Steps] " . $msg . "\n");
            }
        });
    })->create();
