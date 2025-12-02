<?php
/**
 * Generate a full media URL based on the application's environment.
 *
 * In production, it returns the base app URL with the relative path.
 * In non-production environments, it prepends '/storage' to the path.
 *
 * @param string|null $relativePath Relative path to the media file.
 * @return string|null Full URL to the media file or null if path is not provided.
 */


if (!function_exists('media_path')) {
    function media_path(?string $relativePath): ?string
    {
        if (!$relativePath) return null;

        $base = rtrim(config('app.url'), '/');
        $prefix = app()->environment('production') ? '/media' : '/storage';

        return $base . $prefix . '/' . ltrim($relativePath, '/');
    }
}
