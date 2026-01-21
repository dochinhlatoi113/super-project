<?php
/**
 * Class PaymentController
 *
 * Controller for handling API endpoints
 * Provides REST API operations
 */namespace App\Domain\Payment\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Domain\Payment\Services\PaymentService;
use App\Domain\Payment\Http\Requests\StorePaymentRequest;
use App\Domain\Payment\Http\Requests\UpdatePaymentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $service;

    /**
     * PaymentController constructor.
     *
     * @param mixed $service Service instance for business logic
     */    public function __construct(PaymentService $service)
    {
        $this->service = $service;
    }

    /**
     * Get paginated list of items
     *
     * @return \Illuminate\Http\JsonResponse Response containing paginated data
     */    // public function index()
    // {
    //     return response()->json($this->service->list());
    // }

    /**
     * Create a new item
     *
     * @param mixed $request Request object containing validated data
     * @return \Illuminate\Http\JsonResponse Response containing created item
     */    // public function store(StorePaymentRequest $request)
    // {
    //     return response()->json($this->service->create($request->validated()), 201);
    // }

    /**
     * Update an existing item
     *
     * @param mixed $request Request object containing validated data
     * @param string $id Item identifier
     * @return \Illuminate\Http\JsonResponse Response containing updated item
     */    // public function update(UpdatePaymentRequest $request, $id)
    // {
    //     return response()->json($this->service->update($id, $request->validated()));
    // }

    /**
     * Delete an item by identifier
     *
     * @param string $id Item identifier
     * @return \Illuminate\Http\JsonResponse Response indicating deletion result
     */    // public function destroy($id)
    // {
    //     $this->service->delete($id);
    //     return response()->json(['message' => 'Deleted successfully']);
   // }

    public function createVnpayPayment(Request $request)
    {
          
        $request->validate([
            'order_id' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'payment_method_id' => 'nullable|integer'
        ]);

        $paymentData = [
            'order_id' => $request->order_id,
            'payment_code' => 'PAY_' . time() . '_' . rand(1000, 9999),
            'amount' => $request->amount,
            'currency' => 'VND',
            'payment_method' => 'vnpay',
            'payment_gateway' => 'VNPay',
            'status' => 'initiated',
            'payment_method_id' => $request->payment_method_id
        ];
    
        $payment = $this->service->createPayment($paymentData);
        // Lấy IP client để truyền sang service
        $clientIp = $request->ip();
        $vnpayUrl = $this->service->generateVnpayUrl($payment, $clientIp);
        return response()->json([
            'payment_id' => $payment->id,
            'vnpay_url' => $vnpayUrl
        ]);
    }

    public function vnpayReturn(Request $request)
    {
        $vnp_HashSecret = config('vnpay.hash_secret');
        $inputData = $request->all();
        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';
        unset($inputData['vnp_SecureHashType']);
        unset($inputData['vnp_SecureHash']);
        ksort($inputData);
        $hashData = urldecode(http_build_query($inputData));
        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($secureHash === $vnp_SecureHash) {
            $this->service->processVnpayCallback($inputData);
            return response()->json(['message' => 'Payment processed successfully', 'data' => $inputData]);
        } else {
            return response()->json(['message' => 'Invalid signature'], 400);
        }
    }
}
