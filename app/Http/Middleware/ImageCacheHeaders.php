<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ImageCacheHeaders
{
    /**
     * Add long-lived cache headers for static image assets so repeat visits load faster.
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var \Symfony\Component\HttpFoundation\Response $response */
        $response = $next($request);

        $path = $request->path(); // e.g. "assets/img/Book.webp" or "build/assets/app-xxx.js"

        // Long-lived cache for static assets (images + Vite build hashes)
        if ($this->isAssetImagePath($path) || $this->isBuildAssetPath($path)) {
            // One year cache, immutable so browser won't revalidate on reload.
            $response->headers->set('Cache-Control', 'public, max-age=31536000, immutable');
        }

        return $response;
    }

    /**
     * Determine if the path points to one of our static image assets.
     */
    private function isAssetImagePath(string $path): bool
    {
        if (! str_starts_with($path, 'assets/img/')) {
            return false;
        }

        $lower = strtolower($path);

        return str_ends_with($lower, '.webp')
            || str_ends_with($lower, '.png')
            || str_ends_with($lower, '.jpg')
            || str_ends_with($lower, '.jpeg')
            || str_ends_with($lower, '.gif')
            || str_ends_with($lower, '.svg');
    }

    /**
     * Vite build assets (hashed filenames) are immutable.
     */
    private function isBuildAssetPath(string $path): bool
    {
        return str_starts_with($path, 'build/assets/')
            && (str_ends_with($path, '.js') || str_ends_with($path, '.css'));
    }
}

