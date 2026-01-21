<?php
/**
 * Class ProductVariantAlbumsController
 *
 * Controller for handling API endpoints
 * Provides REST API operations
 */namespace App\Domain\ProductVariantAlbums\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Domain\ProductVariantAlbums\Services\ProductVariantAlbumsService;
use App\Domain\ProductVariantAlbums\Http\Requests\StoreProductVariantAlbumsRequest;
use App\Domain\ProductVariantAlbums\Http\Requests\UpdateProductVariantAlbumsRequest;

class ProductVariantAlbumsController extends Controller
{
    protected $service;

    /**
     * ProductVariantAlbumsController constructor.
     *
     * @param mixed $service Service instance for business logic
     */    public function __construct(ProductVariantAlbumsService $service)
    {
        $this->service = $service;
    }

    /**
     * Get paginated list of items
     *
     * @return \Illuminate\Http\JsonResponse Response containing paginated data
     */    public function index()
    {
        return response()->json($this->service->list());
    }

    /**
     * Create a new item
     *
     * @param mixed $request Request object containing validated data
     * @return \Illuminate\Http\JsonResponse Response containing created item
     */    public function store(StoreProductVariantAlbumsRequest $request)
    {
        return response()->json($this->service->create($request->validated()), 201);
    }

    /**
     * Update an existing item
     *
     * @param mixed $request Request object containing validated data
     * @param string $id Item identifier
     * @return \Illuminate\Http\JsonResponse Response containing updated item
     */    public function update(UpdateProductVariantAlbumsRequest $request, $id)
    {
        return response()->json($this->service->update($id, $request->validated()));
    }

    /**
     * Delete an item by identifier
     *
     * @param string $id Item identifier
     * @return \Illuminate\Http\JsonResponse Response indicating deletion result
     */    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
