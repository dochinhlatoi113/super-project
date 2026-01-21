<?php
/**
 * Interface PaymentRepositoryInterface
 *
 * Repository interface for data access operations
 * Defines contract for data layer implementations
 */namespace App\Domain\Payment\Repositories;
use App\Domain\Payment\Entities\Payment;

interface PaymentRepositoryInterface
{
    public function findById($id): ?Payment;
    public function findByOrderId($orderId): ?Payment;
    public function findByTransactionId($transactionId): ?Payment;
    public function create(array $data): Payment;
    public function update($id, array $data): bool;
    public function updateStatus($id, $status): bool;
    public function delete($id): bool;
}
