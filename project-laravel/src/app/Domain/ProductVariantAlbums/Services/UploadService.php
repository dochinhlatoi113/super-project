<?php
/**
 * Class UploadService
 *
 * Service layer for handling business logic
 * Provides CRUD operations and business rules
 */
namespace App\Domain\ProductVariantAlbums\Services;

use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

class UploadService
{
    public function upload($file): string
    {
        Configuration::instance([
            'cloud' => [
                'cloud_name' => 'dn2wekths',
                'api_key'    => '814599424199289',
                'api_secret' => '7PIhL2gix3U7W5qViSEfWL5pcmA',
            ],
            'url' => ['secure' => true]
        ]);
        $result = (new UploadApi())->upload($file->getPathname());
        return $result['secure_url'];
    }
}
