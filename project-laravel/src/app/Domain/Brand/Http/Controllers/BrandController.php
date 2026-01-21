<?php
/**
 * Class BrandController
 *
 * Controller for handling API endpoints
 * Provides REST API operations
 */
namespace App\Domain\Brand\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Domain\Brand\Services\BrandService;
use App\Domain\Brand\Http\Requests\StoreBrandRequest;
use App\Domain\Brand\Http\Requests\UpdateBrandRequest;
use App\Domain\Helpers\BaseApiResponse;
use Illuminate\Support\Facades\Log;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "StoreBrandRequest",
    required: ["name", "slug"],
    properties: [
        new OA\Property(property: "name", type: "string", example: "Nike"),
        new OA\Property(property: "slug", type: "string", example: "nike"),
        new OA\Property(property: "description", type: "string", example: "Nike brand description")
    ]
)]
#[OA\Schema(
    schema: "UpdateBrandRequest",
    properties: [
        new OA\Property(property: "name", type: "string", example: "Nike"),
        new OA\Property(property: "slug", type: "string", example: "nike"),
        new OA\Property(property: "description", type: "string", example: "Nike brand description")
    ]
)]
class BrandController extends Controller
{
    use BaseApiResponse;

    protected BrandService $service;

    /**
     * BrandController constructor.
     *
     * @param mixed $service Service instance for business logic
     */    public function __construct(BrandService $service)
    {
        $this->service = $service;
    }

    #[OA\Get(
        path: "/api/v1/brands",
        summary: "Get list of brands",
        tags: ["Brands"],
        responses: [
            new OA\Response(response: 200, description: "Brands retrieved successfully")
        ]
    )]
    /**
     * Get paginated list of items
     *
     * @return \Illuminate\Http\JsonResponse Response containing paginated data
     */    public function index()
    {
        try {
            $brands = $this->service->list();
            return $this->paginatedResponse($brands, 'Brands retrieved successfully');
        } catch (\Throwable $e) {
            Log::channel('brand')->error('Failed to retrieve brands in BrandController::index()', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                // 'trace' => $e->getTraceAsString()
            ]);
            return $this->serverErrorResponse(
                'Failed to retrieve brands',
                config('app.debug') ? [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null
            );
        }
    }

    #[OA\Post(
        path: "/api/v1/brands",
        summary: "Create a new brand",
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: "#/components/schemas/StoreBrandRequest")
        ),
        tags: ["Brands"],
        responses: [
            new OA\Response(response: 201, description: "Brand created successfully"),
            new OA\Response(response: 422, description: "Validation error")
        ]
    )]
    /**
     * Create a new item
     *
     * @param mixed $request Request object containing validated data
     * @return \Illuminate\Http\JsonResponse Response containing created item
     */    public function store(StoreBrandRequest $request)
    {
        try {
            $brand = $this->service->create($request->validated());
            return $this->createdResponse($brand, 'Brand created successfully');
        } catch (\Throwable $e) {
            Log::channel('brand')->error('Failed to create brand in BrandController::store()', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                // 'trace' => $e->getTraceAsString()
            ]);
            return $this->serverErrorResponse(
                'Failed to create brand',
                config('app.debug') ? [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null
            );
        }
    }

    #[OA\Get(
        path: "/api/v1/brands/{slug}",
        summary: "Get a brand by slug",
        tags: ["Brands"],
        parameters: [
            new OA\Parameter(
                name: "slug",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "string")
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Brand retrieved successfully"),
            new OA\Response(response: 404, description: "Brand not found")
        ]
    )]
    /**
     * Get a specific item by identifier
     *
     * @param string $id Item identifier
     * @return \Illuminate\Http\JsonResponse Response containing item data
     */    public function show(string $slug)
    {
        $brand = $this->service->findBySlug($slug);

        if (!$brand) {
            return $this->notFoundResponse('Brand not found');
        }

        return $this->successResponse($brand, 'Brand retrieved successfully');
    }

    #[OA\Put(
        path: "/api/v1/brands/{slug}",
        summary: "Update a brand",
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: "#/components/schemas/UpdateBrandRequest")
        ),
        tags: ["Brands"],
        parameters: [
            new OA\Parameter(
                name: "slug",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "string")
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Brand updated successfully"),
            new OA\Response(response: 404, description: "Brand not found"),
            new OA\Response(response: 422, description: "Validation error")
        ]
    )]
    /**
     * Update an existing item
     *
     * @param mixed $request Request object containing validated data
     * @param string $id Item identifier
     * @return \Illuminate\Http\JsonResponse Response containing updated item
     */    public function update(UpdateBrandRequest $request, string $slug)
    {
        try {
            $brand = $this->service->update($slug, $request->validated());
            return $this->successResponse($brand, 'Brand updated successfully');
        } catch (\Throwable $e) {
            Log::channel('brand')->error('Failed to update brand in BrandController::update()', [
                'slug' => $slug,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                // 'trace' => $e->getTraceAsString()
            ]);

            if (str_contains($e->getMessage(), 'not found')) {
                return $this->notFoundResponse('Brand not found');
            }

            return $this->serverErrorResponse(
                'Failed to update brand',
                config('app.debug') ? [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null
            );
        }
    }

    #[OA\Delete(
        path: "/api/v1/brands/{slug}",
        summary: "Delete a brand",
        tags: ["Brands"],
        parameters: [
            new OA\Parameter(
                name: "slug",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "string")
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Brand deleted successfully"),
            new OA\Response(response: 404, description: "Brand not found")
        ]
    )]
    /**
     * Delete an item by identifier
     *
     * @param string $id Item identifier
     * @return \Illuminate\Http\JsonResponse Response indicating deletion result
     */    public function destroy(string $slug)
    {
        try {
            $this->service->delete($slug);
            return $this->deletedResponse('Brand deleted successfully');
        } catch (\Throwable $e) {
            Log::channel('brand')->error('Failed to delete brand in BrandController::destroy()', [
                'slug' => $slug,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                // 'trace' => $e->getTraceAsString()
            ]);

            if (str_contains($e->getMessage(), 'not found')) {
                return $this->notFoundResponse('Brand not found');
            }

            return $this->serverErrorResponse(
                'Failed to delete brand',
                config('app.debug') ? [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null
            );
        }
    }
}
