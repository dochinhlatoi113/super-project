<?php
return [
    'tmn_code' => env('VNPAY_TMN_CODE', 'VNPAY_SANDBOX_TMN_CODE'),
    'hash_secret' => env('VNPAY_HASH_SECRET', 'VNPAY_SANDBOX_HASH_SECRET'),
    'url' => env('VNPAY_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'),
    'return_url' => env('VNPAY_RETURN_URL', 'http://localhost:3000/vnpay-return'),
];