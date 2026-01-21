<?php
/**
 * Class OpenApiController
 *
 * Controller for handling API endpoints
 * Provides REST API operations
 */
namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "Laravel API Documentation",
    version: "1.0.0",
    description: "API documentation for Laravel application",
    contact: new OA\Contact(email: "admin@example.com")
)]
#[OA\Server(
    url: "http://127.0.0.1:8000",
    description: "Local development server"
)]
#[OA\Server(
    url: "https://api.example.com",
    description: "Production server"
)]
class OpenApiController
{
    //
}
