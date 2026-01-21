<?php
/**
 * Class Payment
 *
 * Domain entity representing business object
 * Contains business logic and data validation
 */namespace App\Domain\Payment\Entities;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';
    protected $fillable = [
        'order_id',
        'payment_code',
        'amount',
        'currency',
        'payment_method',
        'payment_gateway',
        'status',
        'payment_method_id',
        'transaction_id',
        'vnpay_transaction_no',
        'vnpay_response_code',
        'paid_at'
    ];
    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime'
    ];

    public function order()
    {
        return $this->belongsTo(\App\Models\Order::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(\App\Models\PaymentMethod::class);
    }
}
