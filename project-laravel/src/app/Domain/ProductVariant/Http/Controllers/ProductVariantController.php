<?php
namespace App\Domain\ProductVariant\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Domain\ProductVariant\Services\ProductVariantService;
use App\Domain\ProductVariant\Http\Requests\StoreProductVariantRequest;
use App\Domain\ProductVariant\Http\Requests\UpdateProductVariantRequest;

class ProductVariantController extends Controller
{
    protected $service;

    public function __construct(ProductVariantService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json($this->service->list());
    }


    public function store(StoreProductVariantRequest $request)
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

    public function update(UpdateProductVariantRequest $request, $id)
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

    public function destroy($id)
    {
        // Xóa luôn các thuộc tính động EAV khi xóa variant
        $attrRepo = app(\App\Domain\ProductVariant\Repositories\ProductVariantAttributeRepository::class);
        $attrRepo->getByVariant($id)->each->delete();
        $this->service->delete($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
