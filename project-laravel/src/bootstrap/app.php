<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Dotenv\Dotenv;

$envType = getenv('APP_ENV') ?: 'local';
$envDir = __DIR__ . '/../env-main/';
$envFile = ".env.{$envType}";

if (file_exists("{$envDir}/{$envFile}")) {
    $dotenv = Dotenv::createMutable($envDir, $envFile);
    $dotenv->load();
    //echo "✅ Loaded env file: {$envDir}{$envFile}\n";
} //else {
    //echo "⚠️ Env file not found: {$envDir}/{$envFile}\n";
//}

return Application::configure(
    basePath: dirname(__DIR__),
)
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(fn (Middleware $middleware) => null)
    ->withExceptions(fn (Exceptions $exceptions) => null)
    ->create();
