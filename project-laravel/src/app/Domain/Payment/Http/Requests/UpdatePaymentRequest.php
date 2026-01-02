<?php
namespace App\Domain\Payment\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        return [
            'status' => 'nullable|in:pending,paid,failed,cancelled',
            'transaction_id' => 'nullable|string',
            'vnpay_response_code' => 'nullable|string',
            'vnpay_transaction_no' => 'nullable|string',
        ];
    }
}
