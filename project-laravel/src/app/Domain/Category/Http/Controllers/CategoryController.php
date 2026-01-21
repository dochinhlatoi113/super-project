<?php

namespace App\Domain\Category\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Domain\Category\Services\CategoryService;
use App\Domain\Category\Http\Requests\StoreCategoryRequest;
use App\Domain\Category\Http\Requests\UpdateCategoryRequest;
use App\Domain\Helpers\BaseApiResponse;
use Illuminate\Support\Facades\Log;
use OpenApi\Attributes as OA;

/**
 * Class CategoryController
 *
 * Controller for handling Category-related API endpoints
 * Provides CRUD operations for categories through REST API
 */
#[OA\Schema(
    schema: "StoreCategoryRequest",
    required: ["name", "slug"],
    properties: [
        new OA\Property(property: "name", type: "string", example: "Electronics"),
        new OA\Property(property: "slug", type: "string", example: "electronics"),
        new OA\Property(property: "description", type: "string", example: "Electronic products category")
    ]
)]
#[OA\Schema(
    schema: "UpdateCategoryRequest",
    properties: [
        new OA\Property(property: "name", type: "string", example: "Electronics"),
        new OA\Property(property: "slug", type: "string", example: "electronics"),
        new OA\Property(property: "description", type: "string", example: "Electronic products category")
    ]
)]
class CategoryController extends Controller
{
    use BaseApiResponse;

    protected CategoryService $service;

    /**
     * CategoryController constructor.
     *
     * @param CategoryService $service Service instance for handling business logic
     */
    public function __construct(CategoryService $service)
    {
        $this->service = $service;
    }

    /**
     * Get paginated list of all categories
     *
     * @return \Illuminate\Http\JsonResponse Response containing paginated categories list
     * @throws \Throwable When error occurs during data retrieval
     */
    #[OA\Get(
        path: "/api/v1/categories",
        summary: "Get list of categories",
        tags: ["Categories"],
        responses: [
            new OA\Response(response: 200, description: "Categories retrieved successfully")
        ]
    )]
    public function index()
    {
        try {
            $categories = $this->service->list();
            return $this->paginatedResponse($categories, 'Categories retrieved successfully');
        } catch (\Throwable $e) {
            Log::channel('category')->error('Failed to retrieve categories in CategoryController::index()', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return $this->serverErrorResponse(
                'Failed to retrieve categories',
                config('app.debug') ? [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null
            );
        }
    }

    /**
     * Create a new category
     *
     * @param StoreCategoryRequest $request Request object containing validated data
     * @return \Illuminate\Http\JsonResponse Response containing created category
     * @throws \Throwable When error occurs during category creation
     */
    #[OA\Post(
        path: "/api/v1/categories",
        summary: "Create a new category",
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: "#/components/schemas/StoreCategoryRequest")
        ),
        tags: ["Categories"],
        responses: [
            new OA\Response(response: 201, description: "Category created successfully"),
            new OA\Response(response: 422, description: "Validation error")
        ]
    )]
    public function store(StoreCategoryRequest $request)
    {
        try {
            $category = $this->service->create($request->validated());
            return $this->createdResponse($category, 'Category created successfully');
        } catch (\Throwable $e) {
            Log::channel('category')->error('Failed to create category in CategoryController::store()', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return $this->serverErrorResponse(
                'Failed to create category',
                config('app.debug') ? [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null
            );
        }
    }

    /**
     * Get a specific category by slug
     *
     * @param string $slug Category slug to retrieve
     * @return \Illuminate\Http\JsonResponse Response containing category data or not found error
     */
    #[OA\Get(
        path: "/api/v1/categories/{slug}",
        summary: "Get a category by slug",
        tags: ["Categories"],
        parameters: [
            new OA\Parameter(
                name: "slug",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "string")
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Category retrieved successfully"),
            new OA\Response(response: 404, description: "Category not found")
        ]
    )]
    public function show(string $slug)
    {
        $category = $this->service->findBySlug($slug);

        if (!$category) {
            return $this->notFoundResponse('Category not found');
        }

        return $this->successResponse($category, 'Category retrieved successfully');
    }

    /**
     * Update an existing category
     *
     * @param UpdateCategoryRequest $request Request object containing validated update data
     * @param string $slug Category slug to update
     * @return \Illuminate\Http\JsonResponse Response containing updated category or error
     * @throws \Throwable When error occurs during category update
     */
    #[OA\Put(
        path: "/api/v1/categories/{slug}",
        summary: "Update a category",
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: "#/components/schemas/UpdateCategoryRequest")
        ),
        tags: ["Categories"],
        parameters: [
            new OA\Parameter(
                name: "slug",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "string")
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Category updated successfully"),
            new OA\Response(response: 404, description: "Category not found"),
            new OA\Response(response: 422, description: "Validation error")
        ]
    )]
    public function update(UpdateCategoryRequest $request, string $slug)
    {
        try {
            $category = $this->service->update($slug, $request->validated());
            return $this->successResponse($category, 'Category updated successfully');
        } catch (\Throwable $e) {
            Log::channel('category')->error('Failed to update category in CategoryController::update()', [
                'slug' => $slug,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            if (str_contains($e->getMessage(), 'not found')) {
                return $this->notFoundResponse('Category not found');
            }

            return $this->serverErrorResponse(
                'Failed to update category',
                config('app.debug') ? [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null
            );
        }
    }

    /**
     * Delete a category by slug
     *
     * @param string $slug Category slug to delete
     * @return \Illuminate\Http\JsonResponse Response indicating deletion result or error
     * @throws \Throwable When error occurs during category deletion
     */
    #[OA\Delete(
        path: "/api/v1/categories/{slug}",
        summary: "Delete a category",
        tags: ["Categories"],
        parameters: [
            new OA\Parameter(
                name: "slug",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "string")
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Category deleted successfully"),
            new OA\Response(response: 404, description: "Category not found")
        ]
    )]
    public function destroy(string $slug)
    {
        try {
            $this->service->delete($slug);
            return $this->deletedResponse('Category deleted successfully');
        } catch (\Throwable $e) {
            Log::channel('category')->error('Failed to delete category in CategoryController::destroy()', [
                'slug' => $slug,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            if (str_contains($e->getMessage(), 'not found')) {
                return $this->notFoundResponse('Category not found');
            }

            return $this->serverErrorResponse(
                'Failed to delete category',
                config('app.debug') ? [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null
            );
        }
    }
}