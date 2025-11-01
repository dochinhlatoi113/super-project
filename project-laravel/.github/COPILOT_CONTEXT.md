`````markdown
COPILOT — NGỮ CẢNH DỰ ÁN (Tiếng Việt)

## Mục đích

Tệp này tóm tắt ngữ cảnh quan trọng và quy tắc làm việc cho bất kỳ trợ lý AI nào tương tác với repository này. Mục tiêu: minh bạch, an toàn, dễ rollback.

## Tóm tắt ngắn dự án (hiện trạng)

-   Dự án: ứng dụng Laravel (mã nguồn trong `src/`).
-   Hạ tầng dev: Docker Compose trong `docker-main/` chứa Elasticsearch, Kibana, Logstash, Kafka, MySQL, PHP, nginx, v.v.
-   Logstash pipeline chính: `docker-main/logstash/pipeline/logstash.conf` (đang được debug — hiện pipeline đã load thành công sau khi backup được di chuyển ra khỏi thư mục pipeline).
-   Kibana saved objects exports: có file `system-dashboard.ndjson` (import gặp lỗi nếu `panelsJSON` không khớp `references`).

## Quy tắc bắt buộc trước khi thay đổi

Trước khi chỉnh sửa mã hoặc cấu hình trong repository này, bắt buộc thực hiện theo checklist bên dưới. Mỗi mục kèm một ví dụ/lenh mẫu để dễ thao tác.

1. Xác định phạm vi và đọc file liên quan

    - Tìm chính xác file(s) sẽ thay đổi (ví dụ: `src/app/Domain/Product/...`, `docker-main/logstash/pipeline/logstash.conf`).
    - Dùng grep/rg nếu cần: `rg "pattern" src/` hoặc `git grep "symbol"`.

2. Tạo backup trước khi sửa

    - Luôn copy file gốc vào `backup-files/` hoặc `.bak` với timestamp.
    - Ví dụ:
        ```bash
        mkdir -p backup-files
        cp docker-main/logstash/pipeline/logstash.conf "backup-files/logstash.conf.bak.$(date +%Y%m%d%H%M%S)"
        ```

3. Viết ngắn gọn: "Vấn đề -> Đề xuất -> Rủi ro -> Cách rollback"

    - Mỗi PR hoặc patch nhỏ cần kèm phần mô tả theo mẫu này trong commit message hoặc PR description.

4. Kiểm tra môi trường trước khi deploy thay đổi hạ tầng

    - KHÔNG chạy migrations/reindex trên production khi chưa có approval rõ ràng.

5. Nếu thêm/pind thay đổi PHP (class mới, namespace...)

    - Chạy `composer dump-autoload -o` trong container dev:
        ```bash
        docker-compose -f docker-main/docker-compose.yml exec laravel_php bash -lc "cd /var/www/html && composer dump-autoload -o"
        ```

6. Không công khai secrets

    - Nếu phát hiện secret trong repo: báo ngay, xoá khỏi commit lịch sử và hướng dẫn rotate key.

7. Chỉ tạo file test tạm thời khi cần và xóa sau khi hoàn tất

    - Nếu cần tạo file test, đánh dấu rõ ràng và xóa trong commit cuối cùng.

8. Yêu cầu xác nhận người dùng trước khi thay đổi quan trọng

    - Trước khi thay đổi config Logstash/Kibana/Elasticsearch hoặc các script reindex, hỏi user 1 câu xác nhận.

9. Commit message/PR phải kèm rollback steps ngắn

    - Ví dụ rollback cho config file:
        ```bash
        cp backup-files/logstash.conf.bak.20251023T123456 docker-main/logstash/pipeline/logstash.conf
        # restart logstash
        docker-compose -f docker-main/docker-compose.yml restart logstash
        ```

10. Luôn trả lời tiếng Việt khi tương tác trong khung chat Copilot
    - Trình bày rõ ràng theo mẫu "Vấn đề -> Đề xuất -> Rủi ro -> Rollback".

11 . Luôn đưa ra giải pháp tối ưu không cần hỏi tôi xem chọn cái nào
Phần này được viết ngắn, thực dụng — nếu bạn muốn, tôi sẽ thêm mẫu commit/PR template tự động dựa trên checklist này.

12. luôn lặp lại câu hỏi và giải thích lại câu hỏi đó để cho github copilot hiểu thật sự trước khi làm

13. Tất cả các table khi nói sửa, tạo mới deu phải có is_active,is_primary,deleted_at
## Đường dẫn ưu tiên để đọc

1. `src/` — mã Laravel (Controllers, Services, Models, Providers)
2. `src/app/Domain/**` — code theo domain
3. `src/config/*.php`, `src/bootstrap/*`
4. `docker-main/` — docker-compose & cấu hình dịch vụ
5. `docker-main/logstash/pipeline` — pipeline Logstash
6. `src/storage/logs/laravel.log` — kiểm tra khi gặp lỗi runtime

## Giao tiếp với user

-   Nếu thiếu thông tin: hỏi 1–2 câu cụ thể (ví dụ: "Bạn muốn tôi sửa `system-dashboard.ndjson` trực tiếp không?" ).
-   Luôn viết giải thích ngắn: "Vấn đề -> Đề xuất -> Rủi ro -> Rollback".

Ghi chú: giữ file này ngắn gọn, cập nhật khi trạng thái hạ tầng thay đổi.

````COPILOT — NGỮ CẢNH DỰ ÁN (Tiếng Việt)

## Mục đích

Tệp này cung cấp hướng dẫn ngắn, rõ ràng cho GitHub Copilot hoặc các trợ lý AI khi làm việc trên dự án Laravel này. Mục tiêu: an toàn, dễ kiểm tra, và dễ rollback.

-   `src/config/*.php` và `src/bootstrap/*`

```markdown
COPILOT — NGỮ CẢNH DỰ ÁN (Tiếng Việt)

Mục tiêu: cung cấp hướng dẫn ngắn, rõ ràng cho GitHub Copilot / trợ lý AI khi làm việc trên dự án Laravel này. Ưu tiên: an toàn, dễ kiểm tra, dễ rollback.

Quy tắc bắt buộc:

-   Luôn trả lời,hiển thị các bước làm trong khung chat github copilot,luôn gợi ý theo phương an tối ưu nhất bằng TIẾNG VIỆT.
-   Trước khi gợi ý hoặc thay đổi mã, PHẢI đọc (scan) các tệp nguồn liên quan.
-   KHÔNG tự ý tạo file mới hoặc sửa file quan trọng mà không có XÁC NHẬN từ người dùng.
-   Khi đề xuất, ưu tiên phương án an toàn, ít rủi ro, dễ rollback. Nếu có trade-off, nêu rõ.
-   Không tạo file không cần thiết (chỉ tập trung vào PHP/Laravel trừ khi được yêu cầu).
-   Luôn để comment bằng tiếng Anh trong code thay đổi.

Đường dẫn ưu tiên để đọc (theo thứ tự):

1. `src/` — mã Laravel chính (Controllers, Services, Repositories, Migrations)
2. `src/app/Domain/**` — code theo domain
3. `src/config/*.php`, `src/bootstrap/*`
4. `docker-main/` — docker-compose & cấu hình dịch vụ (MySQL, Elasticsearch, Kibana, Logstash, Kafka)
5. `docker-main/logstash/pipeline`
6. `src/storage/logs/laravel.log` — kiểm tra khi gặp lỗi runtime

Checklist bắt buộc trước khi thay đổi mã:

1. Xác định chính xác file(s) liên quan.
2. Tạo (hoặc yêu cầu) bản backup cho file(s) sẽ thay đổi.
3. Trình bày ngắn: "Vấn đề -> Đề xuất -> Rủi ro -> Cách rollback".
4. Nếu thêm class mới, chạy `composer dump-autoload -o` trong container `laravel_php`.
5. Luôn yêu cầu XÁC NHẬN của người dùng trước khi áp dụng thay đổi.

Quy trình debug nhanh (khi gặp lỗi 500 / Class not found):

1. Mở `src/storage/logs/laravel.log` và lấy stack trace.
2. Tìm file/class bị báo missing trong `src/` và trong backup `/tmp/recover-backup-*.tar.gz`.
3. Nếu có backup: phục hồi file, chạy `composer dump-autoload -o` trong container `laravel_php`.
4. Thử lại endpoint (curl) hoặc lệnh artisan; báo kết quả cho user.

Hướng dẫn khi thay đổi hạ tầng (ELK / Kafka / MySQL):

-   Thay đổi từng bước, restart service tương ứng, đọc logs sau mỗi bước.
-   Với Kibana saved-object import: kiểm tra `panelsJSON` và `references` nếu gặp lỗi migrate.
-   KHÔNG chạy migrations trên production mà không có xác nhận rõ ràng.

Bảo mật:

-   Không in secrets (mật khẩu, API keys) ra output công khai.
-   Nếu phát hiện secret trong repo, gợi ý cách rotate và xóa khỏi lịch sử (nêu bước, không tự động thực hiện).

Giao tiếp với người dùng:

-   Nếu thiếu thông tin: hỏi 1–2 câu ngắn, cụ thể (ví dụ: "Bạn muốn tôi sửa file X trực tiếp hay chỉ gợi ý?").
-   Khi đề xuất thay đổi: trình bày theo mẫu "Vấn đề -> Đề xuất -> Rủi ro -> Cách rollback".

Ví dụ ngắn (kịch bản):

-   Issue: endpoint `/api/v1/products` trả 500.
    1. Mở `src/storage/logs/laravel.log` lấy stack trace.
    2. Tìm class missing (ví dụ `App\Domain\Product\Services\ProductService`).
    3. Tìm trong backup `/tmp/recover-backup-*.tar.gz`.
    4. Nếu tìm thấy, phục hồi, chạy `composer dump-autoload -o` trong container `laravel_php`.
    5. Chạy smoke test (curl) và báo kết quả.

Ghi chú cuối: luôn ưu tiên an toàn, minh bạch và khả năng rollback. Nếu cần thay đổi DB hoặc hạ tầng, KHÔNG thực hiện trên production mà không xin phép.
```
````
`````
