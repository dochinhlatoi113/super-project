<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

Route::prefix('v1')->group(function () {
    // Load routes from /routes/Api (legacy or shared routes)
    $routePath = __DIR__ . '/Api';
    if (File::exists($routePath)) {
        foreach (File::allFiles($routePath) as $file) {
            require $file->getPathname();
        }
    }

    // Load routes from Domain folders
    $domainPath = app_path('Domain');
    $domains = ['Product', 'Category', 'Brand', 'Payment']; // Add more domains as needed

    foreach ($domains as $domain) {
        $domainRoutePath = "{$domainPath}/{$domain}/routes";
        if (File::exists($domainRoutePath)) {
            foreach (File::allFiles($domainRoutePath) as $file) {
                require $file->getPathname();
            }
        }
    }
});
