<?php

namespace App\Domain\Category\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Domain\Category\Services\CategoryService;
use App\Domain\Category\Http\Requests\StoreCategoryRequest;
use App\Domain\Category\Http\Requests\UpdateCategoryRequest;
use App\Domain\Helpers\BaseApiResponse;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    use BaseApiResponse;

    protected CategoryService $service;

    public function __construct(CategoryService $service)
    {
        $this->service = $service;
    }

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
                // 'trace' => $e->getTraceAsString()
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
                // 'trace' => $e->getTraceAsString()
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

    public function show(string $slug)
    {
        $category = $this->service->findBySlug($slug);

        if (!$category) {
            return $this->notFoundResponse('Category not found');
        }

        return $this->successResponse($category, 'Category retrieved successfully');
    }

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
                // 'trace' => $e->getTraceAsString()
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
                // 'trace' => $e->getTraceAsString()
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
