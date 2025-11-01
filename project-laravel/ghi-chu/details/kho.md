Kien trúc
💡 Tóm tắt theo DDD / Module

Domain	Chức năng chính
Product	SKU, giá, tồn kho, danh mục, quản lý hình ảnh/variant, barcode/QR code, nhãn sản phẩm, thông tin nhà sản xuất
Warehouse	Nhập/ xuất/ chuyển kho, kiểm kê, quản lý vị trí lưu kho, cảnh báo tồn kho thấp, phân bổ kho tự động
Supplier	Quản lý nhà cung cấp, đơn nhập, hợp đồng, lịch sử giao dịch, đánh giá nhà cung cấp
Customer / CRM	Quản lý khách hàng, nhóm khách hàng, lịch sử mua hàng, tương tác, chăm sóc, phân loại khách hàng theo giá trị, điểm thưởng/loyalty
Sales / Orders	Đơn bán, trạng thái, thanh toán, tạo hóa đơn, quản lý ưu đãi/giảm giá, quản lý đơn hàng online/offline, tích hợp POS
Logistics / Delivery	Đơn vận chuyển, tracking, phí ship, đối soát vận chuyển, lựa chọn nhà vận chuyển, quản lý kho vận, quản lý tuyến giao hàng
User & Role	Quản lý nhân viên, phân quyền, quản lý nhóm, nhật ký hoạt động, cảnh báo bảo mật
Reporting / Dashboard	Tồn kho, doanh thu, lợi nhuận, cảnh báo, báo cáo chi tiết theo sản phẩm/khách hàng/nhân viên, phân tích KPI, dự báo nhu cầu
Marketing / Promotion	Quản lý chiến dịch, mã giảm giá, khuyến mại, email/SMS marketing, gắn ưu đãi cho khách hàng nhóm cụ thể
Accounting / Finance	Quản lý chi phí, thu chi, thanh toán nhà cung cấp, đối soát đơn hàng, báo cáo tài chính, thuế
Integration / API	Kết nối sàn TMĐT, cổng thanh toán, nhà vận chuyển, ERP, CRM bên ngoài
Notification / Alerts	Thông báo tồn kho, đơn hàng, vận chuyển, nhắc nhở quản lý, email/SMS/Push
------------------------------------

1️⃣ Quản lý sản phẩm (Product Management)

Quản lý danh mục sản phẩm (Category, Sub-category)

Thêm/sửa/xóa sản phẩm

Quản lý SKU, barcode, mô tả, hình ảnh

Quản lý giá bán, giá nhập, giá khuyến mãi

Quản lý tồn kho tối thiểu, cảnh báo tồn kho thấp

2️⃣ Quản lý kho (Warehouse/Stock)

Quản lý nhiều kho (Warehouse)

Nhập kho (Purchase / Stock In)

Xuất kho (Order fulfillment / Stock Out)

Chuyển kho nội bộ (Stock Transfer)

Kiểm kê kho định kỳ (Inventory Count / Stock Adjustment)

Theo dõi tồn kho theo thời gian (History / Audit Trail)

3️⃣ Quản lý nhà cung cấp (Supplier Management)

Thêm/sửa/xóa nhà cung cấp

Lịch sử giao dịch với nhà cung cấp

Quản lý đơn hàng nhập kho (Purchase Order)

Thanh toán và quản lý nợ nhà cung cấp

4️⃣ Quản lý khách hàng (Customer Management / CRM)

Thêm/sửa/xóa khách hàng

Quản lý nhóm khách hàng (VIP, thường, mới…)

Lịch sử mua hàng / giao dịch

Quản lý liên hệ, email, số điện thoại

5️⃣ Quản lý bán hàng (Sales / Orders)

Tạo đơn hàng bán (Sales Order)

Quản lý trạng thái đơn: pending → confirmed → shipped → delivered → cancelled

In hóa đơn / phiếu xuất kho

Theo dõi thanh toán, nợ công khách hàng

Hỗ trợ nhiều kênh bán (online, offline, marketplace)

6️⃣ Quản lý vận chuyển (Logistics / Delivery)

Theo dõi đơn hàng vận chuyển (Shipping / Delivery)

Gán đơn vị vận chuyển (GHTK, GHN, Viettel Post…)

Tính phí vận chuyển tự động / thủ công

Cập nhật trạng thái vận chuyển real-time

7️⃣ Quản lý nhân viên / phân quyền (User & Role Management)

Quản lý user, nhóm user

Phân quyền: xem tồn kho, tạo đơn hàng, nhập kho, xuất kho…

Ghi lại log hoạt động nhân viên (Audit log)

8️⃣ Báo cáo (Reporting / Dashboard)

Báo cáo tồn kho theo sản phẩm, kho, ngày tháng

Báo cáo nhập-xuất tồn kho

Báo cáo doanh thu, lợi nhuận theo khách hàng hoặc sản phẩm

Dashboard realtime: tồn kho thấp, đơn hàng chờ, doanh thu ngày

9️⃣ Tính năng nâng cao (Optional / Future)

Quản lý serial number / batch cho từng sản phẩm

Hệ thống cảnh báo tự động qua email hoặc push notification

API tích hợp marketplace (Shopee, Lazada, Tiki…)

Quản lý nhiều chi nhánh / multi-warehouse

Lịch sử versioning / rollback dữ liệu quan trọng