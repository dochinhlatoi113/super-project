<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domain\ProductSku\Services\ProductSkuService;
use App\Domain\ProductSku\Entities\ProductSku;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductSkuController extends Controller
{
    protected ProductSkuService $skuService;

    public function __construct(ProductSkuService $skuService)
    {
        $this->skuService = $skuService;
    }

    /**
     * Get SKUs for a product variant
     */
    public function getByVariant(int $variantId): JsonResponse
    {
        try {
            $skus = $this->skuService->getByVariant($variantId);

            return response()->json([
                'success' => true,
                'data' => $skus,
                'count' => $skus->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get primary SKU for a variant
     */
    public function getPrimarySku(int $variantId): JsonResponse
    {
        try {
            $sku = $this->skuService->getPrimarySku($variantId);

            return response()->json([
                'success' => true,
                'data' => $sku
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Find SKU by code (SKU or barcode)
     */
    public function findByCode(string $code): JsonResponse
    {
        try {
            $sku = $this->skuService->findByCode($code);

            return response()->json([
                'success' => true,
                'data' => $sku
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Create new SKU
     */
    public function create(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'product_variant_id' => 'required|integer|exists:product_variants,id',
                'sku' => 'nullable|string|unique:product_skus,sku',
                'barcode' => 'nullable|string|unique:product_skus,barcode',
                'type' => 'nullable|in:sku,upc,ean,isbn,qr_code',
                'is_primary' => 'nullable|boolean'
            ]);

            $sku = $this->skuService->create($data);

            return response()->json([
                'success' => true,
                'data' => $sku,
                'message' => 'SKU created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Update SKU
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $data = $request->validate([
                'sku' => 'nullable|string|unique:product_skus,sku,' . $id,
                'barcode' => 'nullable|string|unique:product_skus,barcode,' . $id,
                'type' => 'nullable|in:sku,upc,ean,isbn,qr_code',
                'is_primary' => 'nullable|boolean',
                'is_active' => 'nullable|boolean'
            ]);

            $sku = $this->skuService->update($id, $data);

            return response()->json([
                'success' => true,
                'data' => $sku,
                'message' => 'SKU updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Delete SKU
     */
    public function delete(int $id): JsonResponse
    {
        try {
            $result = $this->skuService->delete($id);

            return response()->json([
                'success' => true,
                'message' => 'SKU deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Set primary SKU for variant
     */
    public function setPrimary(int $variantId, int $skuId): JsonResponse
    {
        try {
            $this->skuService->setPrimarySku($variantId, $skuId);

            return response()->json([
                'success' => true,
                'message' => 'Primary SKU set successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
