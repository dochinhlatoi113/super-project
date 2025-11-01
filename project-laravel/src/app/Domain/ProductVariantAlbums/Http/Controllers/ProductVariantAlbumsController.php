<?php
namespace App\Domain\ProductVariantAlbums\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Domain\ProductVariantAlbums\Services\ProductVariantAlbumsService;
use App\Domain\ProductVariantAlbums\Http\Requests\StoreProductVariantAlbumsRequest;
use App\Domain\ProductVariantAlbums\Http\Requests\UpdateProductVariantAlbumsRequest;

class ProductVariantAlbumsController extends Controller
{
    protected $service;

    public function __construct(ProductVariantAlbumsService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return response()->json($this->service->list());
    }

    public function store(StoreProductVariantAlbumsRequest $request)
    {
        return response()->json($this->service->create($request->validated()), 201);
    }

    public function update(UpdateProductVariantAlbumsRequest $request, $id)
    {
        return response()->json($this->service->update($id, $request->validated()));
    }

    public function destroy($id)
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
