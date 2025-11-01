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
        return response()->json($this->service->create($request->validated()), 201);
    }

    public function update(UpdateProductVariantRequest $request, $id)
    {
        return response()->json($this->service->update($id, $request->validated()));
    }

    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
