# Bảng mã vnp_OrderType chuẩn của VNPay (tham khảo tài liệu):
# - topup: Nạp tiền điện thoại
# - billpayment: Thanh toán hóa đơn
# - fashion: Thời trang
# - other: (KHÔNG dùng, không hợp lệ)
# - ... (xem tài liệu VNPay để cập nhật đầy đủ)

# Gợi ý: Nên để vnp_OrderType là 'billpayment' hoặc đúng mã danh mục hàng hóa thực tế.
# code mau
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
        

1: sai chu ky so
 -check xem xem chuỗi hash đã sort theo alphabet chưa.
-vnp_OrderType ko có giá trị là "other" nhé. Bạn xem bảng mã loại hàng hoá trên trang chủ VNPay.
-Bạn đang dùng bản 2.1.0 thì thuật toán hash là SHA512.
