<?php
/**
 * Class ProductVariantController
 *
 * Controller for handling API endpoints
 * Provides REST API operations
 */namespace App\Domain\ProductVariant\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Domain\ProductVariant\Services\ProductVariantService;
use App\Domain\ProductVariant\Http\Requests\StoreProductVariantRequest;
use App\Domain\ProductVariant\Http\Requests\UpdateProductVariantRequest;

class ProductVariantController extends Controller
{
    protected $service;

    /**
     * ProductVariantController constructor.
     *
     * @param mixed $service Service instance for business logic
     */    public function __construct(ProductVariantService $service)
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
     */    public function store(StoreProductVariantRequest $request)
    {
        $data = $request->validated();
        $attributes = $data['attributes'] ?? [];
        unset($data['attributes']);
        $variant = $this->service->create($data);
        if (!empty($attributes) && isset($variant->id)) {
            $attrRepo = app(\App\Domain\ProductVariant\Repositories\ProductVariantAttributeRepository::class);
            $attrRepo->createMany($variant->id, $attributes);
        }
        return response()->json($variant, 201);
    }

    /**
     * Update an existing item
     *
     * @param mixed $request Request object containing validated data
     * @param string $id Item identifier
     * @return \Illuminate\Http\JsonResponse Response containing updated item
     */    public function update(UpdateProductVariantRequest $request, $id)
    {
        $data = $request->validated();
        $attributes = $data['attributes'] ?? [];
        unset($data['attributes']);
        $variant = $this->service->update($id, $data);
        if (!empty($attributes)) {
            $attrRepo = app(\App\Domain\ProductVariant\Repositories\ProductVariantAttributeRepository::class);
            $attrRepo->updateOrCreateMany($id, $attributes);
        }
        return response()->json($variant);
    }

    /**
     * Delete an item by identifier
     *
     * @param string $id Item identifier
     * @return \Illuminate\Http\JsonResponse Response indicating deletion result
     */    public function destroy($id)
    {
        // Xóa luôn các thuộc tính động EAV khi xóa variant
        $attrRepo = app(\App\Domain\ProductVariant\Repositories\ProductVariantAttributeRepository::class);
        $attrRepo->getByVariant($id)->each->delete();
        $this->service->delete($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
