<?php

namespace App\Domain\ProductSku\Services;

use App\Domain\ProductSku\Entities\ProductSku;
use App\Domain\ProductVariant\Entities\ProductVariant;
use Illuminate\Support\Facades\DB;
use Exception;

class ProductSkuService
{
    /**
     * Create SKU for a product variant
     */
    public function create(array $data)
    {
        // Validate required fields
        if (!isset($data['product_variant_id'])) {
            throw new Exception('Product variant ID is required');
        }

        // Check if variant exists
        $variant = ProductVariant::find($data['product_variant_id']);
        if (!$variant) {
            throw new Exception('Product variant not found');
        }

        // Validate config_index if provided
        if (isset($data['product_variant_config_index'])) {
            $configIndex = (int) $data['product_variant_config_index'];
            $configs = json_decode($variant->config, true);

            if (!isset($configs[$configIndex])) {
                throw new Exception("Config index {$configIndex} does not exist in variant config");
            }

            $data['config_index'] = $configIndex;
            unset($data['product_variant_config_index']);
        }

        // Generate SKU if not provided
        if (!isset($data['sku']) || empty($data['sku'])) {
            $data['sku'] = ProductSku::generateUniqueSku();
        }

        // Generate barcode if not provided and type requires it
        if (!isset($data['barcode']) || empty($data['barcode'])) {
            if (in_array($data['type'] ?? 'sku', ['upc', 'ean', 'isbn'])) {
                $data['barcode'] = ProductSku::generateUniqueBarcode();
            }
        }

        // Set default values
        $data['is_primary'] = $data['is_primary'] ?? false;
        $data['is_active'] = $data['is_active'] ?? true;
        $data['type'] = $data['type'] ?? 'sku';

        // If this is primary SKU, unset other primary SKUs for this variant
        if ($data['is_primary']) {
            ProductSku::where('product_variant_id', $data['product_variant_id'])
                ->where('is_primary', true)
                ->update(['is_primary' => false]);
        }

        return ProductSku::create($data);
    }

    /**
     * Update SKU
     */
    public function update(int $id, array $data)
    {
        $sku = ProductSku::find($id);
        if (!$sku) {
            throw new Exception('SKU not found');
        }

        // Validate uniqueness for update
        if (isset($data['sku']) && $data['sku'] !== $sku->sku) {
            if (!$this->validateSkuUniquenessForUpdate($data['sku'], $id)) {
                throw new Exception('SKU already exists');
            }
        }

        if (isset($data['barcode']) && $data['barcode'] !== $sku->barcode) {
            if (!$this->validateBarcodeUniquenessForUpdate($data['barcode'], $id)) {
                throw new Exception('Barcode already exists');
            }
        }

        // If setting as primary, unset other primary SKUs
        if (isset($data['is_primary']) && $data['is_primary']) {
            ProductSku::where('product_variant_id', $sku->product_variant_id)
                ->where('id', '!=', $id)
                ->where('is_primary', true)
                ->update(['is_primary' => false]);
        }

        $sku->update($data);
        return $sku->fresh();
    }

    /**
     * Delete SKU
     */
    public function delete(int $id)
    {
        $sku = ProductSku::find($id);
        if (!$sku) {
            throw new Exception('SKU not found');
        }

        // Don't allow deleting primary SKU if there are other SKUs
        if ($sku->is_primary) {
            $otherSkus = ProductSku::where('product_variant_id', $sku->product_variant_id)
                ->where('id', '!=', $id)
                ->count();

            if ($otherSkus > 0) {
                throw new Exception('Cannot delete primary SKU when other SKUs exist. Set another SKU as primary first.');
            }
        }

        return $sku->delete();
    }

    /**
     * Get SKUs for a variant
     */
    public function getByVariant(int $variantId)
    {
        return ProductSku::where('product_variant_id', $variantId)
            ->active()
            ->orderBy('is_primary', 'desc')
            ->orderBy('created_at', 'asc')
            ->get();
    }

    /**
     * Get primary SKU for a variant
     */
    public function getPrimarySku(int $variantId)
    {
        return ProductSku::where('product_variant_id', $variantId)
            ->primary()
            ->active()
            ->first();
    }

    /**
     * Find SKU by code (SKU or barcode)
     */
    public function findByCode(string $code)
    {
        return ProductSku::where(function ($query) use ($code) {
            $query->where('sku', $code)
                ->orWhere('barcode', $code);
        })->active()->first();
    }

    /**
     * Bulk create SKUs for variants
     */
    public function bulkCreate(array $skuData)
    {
        $createdSkus = [];

        DB::transaction(function () use ($skuData, &$createdSkus) {
            foreach ($skuData as $data) {
                $createdSkus[] = $this->create($data);
            }
        });

        return $createdSkus;
    }

    /**
     * Generate SKU with custom prefix
     */
    public function generateSkuWithPrefix(string $prefix, int $variantId)
    {
        $variant = ProductVariant::find($variantId);
        if (!$variant) {
            throw new Exception('Product variant not found');
        }

        // Create prefix from product name or custom logic
        $productName = $variant->product->name ?? 'PRD';
        $prefix = strtoupper(substr($productName, 0, 3)) . '-';

        return ProductSku::generateUniqueSku($prefix);
    }

    /**
     * Validate SKU uniqueness for update
     */
    public function validateSkuUniquenessForUpdate(string $sku, ?int $excludeId = null)
    {
        if (!$sku) {
            return true; // Null/empty SKU is allowed
        }

        $query = ProductSku::where('sku', $sku);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return !$query->exists();
    }

    /**
     * Validate barcode uniqueness for update
     */
    public function validateBarcodeUniquenessForUpdate(?string $barcode, ?int $excludeId = null)
    {
        if (!$barcode) {
            return true; // Null barcode is allowed
        }

        $query = ProductSku::where('barcode', $barcode);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return !$query->exists();
    }

    /**
     * Set primary SKU for variant
     */
    public function setPrimarySku(int $variantId, int $skuId)
    {
        DB::transaction(function () use ($variantId, $skuId) {
            // Unset all primary SKUs for this variant
            ProductSku::where('product_variant_id', $variantId)
                ->update(['is_primary' => false]);

            // Set the specified SKU as primary
            $sku = ProductSku::where('product_variant_id', $variantId)
                ->where('id', $skuId)
                ->first();

            if ($sku) {
                $sku->update(['is_primary' => true]);
            } else {
                throw new Exception('SKU not found for this variant');
            }
        });
    }
}
