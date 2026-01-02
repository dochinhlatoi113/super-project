<?php
namespace App\Domain\Payment\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        return [
            'order_id' => 'required|string|max:255',
            'amount' => 'required|numeric|min:1000',
            'currency' => 'nullable|string|default:VND',
            'payment_method_id' => 'nullable|integer|exists:payment_methods,id',
        ];
    }
}
