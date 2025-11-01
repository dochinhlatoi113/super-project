<?php

namespace App\Domain\Brand\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Domain\Brand\Services\BrandService;
use App\Domain\Brand\Http\Requests\StoreBrandRequest;
use App\Domain\Brand\Http\Requests\UpdateBrandRequest;
use App\Domain\Helpers\BaseApiResponse;
use Illuminate\Support\Facades\Log;

class BrandController extends Controller
{
    use BaseApiResponse;

    protected BrandService $service;

    public function __construct(BrandService $service)
    {
        $this->service = $service;
    }

    public function index()
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

    public function store(StoreBrandRequest $request)
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

    public function show(string $slug)
    {
        $brand = $this->service->findBySlug($slug);

        if (!$brand) {
            return $this->notFoundResponse('Brand not found');
        }

        return $this->successResponse($brand, 'Brand retrieved successfully');
    }

    public function update(UpdateBrandRequest $request, string $slug)
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

    public function destroy(string $slug)
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
