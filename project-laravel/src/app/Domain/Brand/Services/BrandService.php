<?php

namespace App\Domain\Brand\Services;

use App\Domain\Brand\Repositories\BrandRepositoryInterface;

class BrandService
{
    protected BrandRepositoryInterface $repo;

    public function __construct(BrandRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function list(int $perPage = 15)
    {
        return $this->repo->paginate($perPage);
    }

    public function findBySlug(string $slug)
    {
        return $this->repo->findBySlug($slug);
    }

    public function create(array $data)
    {
        $data['logo'] = $data['logo'] ?? 'images/no-image.png';
        return $this->repo->create($data);
    }

    public function update(string $slug, array $data)
    {
        $data['logo'] = $data['logo'] ?? 'images/no-image.png';
        return $this->repo->updateBySlug($slug, $data);
    }

    public function delete(string $slug): bool
    {
        return $this->repo->deleteBySlug($slug);
    }
}
