<?php
/**
 * Class PaymentService
 *
 * Service layer for handling business logic
 * Provides CRUD operations and business rules
 */namespace App\Domain\Payment\Services;
use App\Domain\Payment\Repositories\PaymentRepositoryInterface;
use App\Domain\Payment\Entities\Payment;

class PaymentService
{
    protected $repo;

    /**
     * PaymentService constructor.
     *
     * @param mixed $repo Repository instance for data operations
     */    public function __construct(PaymentRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function createPayment(array $data): Payment
    {
        return $this->repo->create($data);
    }

    public function processVnpayCallback(array $vnpData): bool
    {
        $payment = $this->repo->findByOrderId($vnpData['vnp_TxnRef'] ?? null);
        if (!$payment) {
            return false;
        }

        $responseCode = $vnpData['vnp_ResponseCode'] ?? null;
        $transactionNo = $vnpData['vnp_TransactionNo'] ?? null;

        $updateData = [
            'vnpay_response_code' => $responseCode,
            'vnpay_transaction_no' => $transactionNo,
        ];

        if ($responseCode === '00') {
            $updateData['status'] = 'success';
            $updateData['paid_at'] = now();
            $updateData['transaction_id'] = $transactionNo;
        } else {
            $updateData['status'] = 'failed';
        }

        return $this->repo->update($payment->id, $updateData);
    }

    public function generateVnpayUrl(Payment $payment, $clientIp = null): string
    {
        $vnp_TmnCode = config('vnpay.tmn_code');
        $vnp_HashSecret = config('vnpay.hash_secret');
        $vnp_Url = config('vnpay.url');
        $vnp_Returnurl = config('vnpay.return_url');

        // Đảm bảo orderId chỉ chứa ký tự hợp lệ
        $orderId = preg_replace('/[^A-Za-z0-9_-]/', '', (string)$payment->order_id);
        // Đảm bảo amount là số nguyên dương
        $amount = (int)round($payment->amount * 100);
        if ($amount < 1000) {
            $amount = 1000;
        }
        // Đảm bảo OrderInfo không có ký tự lạ
        $orderInfo = preg_replace('/[^A-Za-z0-9 _-]/u', '', 'Thanh toan don hang ' . $orderId);
        $inputData = [
            'vnp_Amount' => (string)$amount,
            'vnp_Command' => 'pay',
            'vnp_CreateDate' => date('YmdHis'),
            'vnp_CurrCode' => 'VND',
            'vnp_IpAddr' => $clientIp ?? '127.0.0.1',
            'vnp_Locale' => 'vn',
            'vnp_OrderInfo' => $orderInfo,
            'vnp_OrderType' => 'billpayment', 
            'vnp_ReturnUrl' => (string)$vnp_Returnurl,
            'vnp_TmnCode' => (string)$vnp_TmnCode,
            'vnp_TxnRef' => (string)$orderId,
            'vnp_Version' => '2.1.0',
        ];

        ksort($inputData);
        $query = [];
        $hashdata = '';
        $i = 0;
        foreach ($inputData as $key => $value) {
            $query[] = urlencode($key) . "=" . urlencode((string)$value);
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode((string)$value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode((string)$value);
                $i = 1;
            }
        }
        $vnp_Url = $vnp_Url . "?" . implode('&', $query);
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
        \Log::info('VNPAY DEBUG', ['hashdata' => $hashdata, 'vnpSecureHash' => $vnpSecureHash, 'inputData' => $inputData]);
        $vnp_Url .= '&vnp_SecureHash=' . $vnpSecureHash;

        return $vnp_Url;
    }
}
