<?php
/**
 * Interface PaymentRepository
 *
 * Repository interface for data access operations
 * Defines contract for data layer implementations
 */namespace App\Domain\Payment\Repositories;
use App\Domain\Payment\Entities\Payment;

class PaymentRepository implements PaymentRepositoryInterface
{
    public function findById($id): ?Payment
    {
        return Payment::find($id);
    }

    public function findByOrderId($orderId): ?Payment
    {
        return Payment::where('order_id', $orderId)->first();
    }

    public function findByTransactionId($transactionId): ?Payment
    {
        return Payment::where('transaction_id', $transactionId)->first();
    }

    public function create(array $data): Payment
    {
        return Payment::create($data);
    }

    public function update($id, array $data): bool
    {
        return Payment::where('id', $id)->update($data) > 0;
    }

    public function updateStatus($id, $status): bool
    {
        return Payment::where('id', $id)->update(['status' => $status]) > 0;
    }

    public function delete($id): bool
    {
        return Payment::destroy($id) > 0;
    }
}
