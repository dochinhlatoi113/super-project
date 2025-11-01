# 📘 KAFKA - HƯỚNG DẪN ĐẦY ĐỦ# 📘 KAFKA - HƯỚNG DẪN ĐẦY ĐỦ

## 📋 MỤC LỤC## 📋 MỤC LỤC

1. [Thông Tin Cơ Bản](#thông-tin-cơ-bản)1. [Thông Tin Cơ Bản](#thông-tin-cơ-bản)

2. [Kafka Product Events](#kafka-product-events)2. [Kafka Product Events](#kafka-product-events)

3. [Kafka Consumers](#kafka-consumers)3. [Kafka Consumers](#kafka-consumers)

4. [Kafka Control Scripts](#kafka-control-scripts)4. [Kafka Control Scripts](#kafka-control-scripts)

5. [Giám sát Kafka bằng Kibana](#giám-sát-kafka-bằng-kibana)5. [Giám sát Kafka bằng Kibana](#giám-sát-kafka-bằng-kibana)

6. [Commands & Quản Lý](#commands--quản-lý)6. [Commands & Quản Lý](#commands--quản-lý)

7. [Troubleshooting](#troubleshooting)7. [Troubleshooting](#troubleshooting)

---

## 📌 THÔNG TIN CƠ BẢN## 📌 THÔNG TIN CƠ BẢN

### Thông số kỹ thuật### Thông số kỹ thuật

-   **Version:** Apache Kafka 3.x- **Version:** Apache Kafka 3.x

-   **Port:** 9092 (broker), 2181 (zookeeper)- **Port:** 9092 (broker), 2181 (zookeeper)

-   **Container:** `laravel_kafka`, `laravel_zookeeper`- **Container:** `laravel_kafka`, `laravel_zookeeper`

-   **Topics:** product_events, product-events, order-events, user-events- **Topics:** product_events, product-events, order-events, user-events

### Kiến trúc Kafka trong Project### Kiến trúc Kafka trong Project

```

Laravel App (Producer)Laravel App (Producer)

    ↓ Publish Events    ↓ Publish Events

Kafka BrokerKafka Broker

├── Topic: product_events├── Topic: product_events

├── Topic: order-events├── Topic: order-events

└── Topic: user-events└── Topic: user-events

    ↓ Consume Events    ↓ Consume Events

3 Consumer Groups:3 Consumer Groups:

├── product-audit-group (Audit Logging)├── product-audit-group (Audit Logging)

├── product-cache-group (Cache Invalidation)├── product-cache-group (Cache Invalidation)

└── product-elasticsearch-group (ES Sync)└── product-elasticsearch-group (ES Sync)

    ↓    ↓

Outputs:Outputs:

├── Audit Logs (Database/File)├── Audit Logs (Database/File)

├── Redis Cache (Clear)├── Redis Cache (Clear)

└── Elasticsearch Index (Sync)└── Elasticsearch Index (Sync)

```

### Message Format### Message Format

`json`json

{{

"action": "created|updated|deleted", "action": "created|updated|deleted",

"product_id": 123, "product_id": 123,

"product_name": "Product Name", "product_name": "Product Name",

"brand_id": 2, "brand_id": 2,

"brand_name": "HP", "brand_name": "HP",

"category_id": 3, "category_id": 3,

"category_name": "Laptops", "category_name": "Laptops",

"timestamp": "2025-10-17T10:00:00Z", "timestamp": "2025-10-17T10:00:00Z",

"data": { "data": {

    "variants": [...],    "variants": [...],

    "...": "..."    "...": "..."

} }

}}

```



------



## 🎯 KAFKA PRODUCT EVENTS## 🎯 KAFKA PRODUCT EVENTS



### Mục đích### Mục đích



Hai consumer group độc lập xử lý product events:Hai consumer group độc lập xử lý product events:



-   **product-audit-group**: Ghi log audit khi CREATE/UPDATE/DELETE sản phẩm-   **product-audit-group**: Ghi log audit khi CREATE/UPDATE/DELETE sản phẩm

-   **product-cache-group**: Xóa cache Redis khi sản phẩm thay đổi-   **product-cache-group**: Xóa cache Redis khi sản phẩm thay đổi

-   **product-elasticsearch-group**: Sync product to Elasticsearch-   **product-elasticsearch-group**: Sync product to Elasticsearch



### Cấu trúc DDD### Cấu trúc DDD



```

src/app/Domain/Product/src/app/Domain/Product/

├── Services/Kafka/├── Services/Kafka/

│ ├── ProductEventProducer.php # Producer gửi events│ ├── ProductEventProducer.php # Producer gửi events

│ ├── ProductAuditConsumer.php # Consumer Group 1 (Audit)│ ├── ProductAuditConsumer.php # Consumer Group 1 (Audit)

│ ├── ProductCacheConsumer.php # Consumer Group 2 (Cache)│ ├── ProductCacheConsumer.php # Consumer Group 2 (Cache)

│ └── ProductElasticsearchConsumer.php # Consumer Group 3 (ES)│ └── ProductElasticsearchConsumer.php # Consumer Group 3 (ES)

├── Console/Commands/├── Console/Commands/

│ ├── ConsumeProductAudit.php # Command: product:kafka-audit│ ├── ConsumeProductAudit.php # Command: product:kafka-audit

│ ├── ConsumeProductCache.php # Command: product:kafka-cache│ ├── ConsumeProductCache.php # Command: product:kafka-cache

│ ├── ConsumeProductElasticsearch.php # Command: product:kafka-elasticsearch│ ├── ConsumeProductElasticsearch.php # Command: product:kafka-elasticsearch

│ └── CreateProductEventsTopic.php # Command: product:kafka-create-topic│ └── CreateProductEventsTopic.php # Command: product:kafka-create-topic

└── Providers/└── Providers/

    └── ProductServiceProvider.php         # Đăng ký commands & bindings    └── ProductServiceProvider.php         # Đăng ký commands & bindings

````



### Producer - Publish Events### Producer - Publish Events



**File:** `app/Domain/Product/Services/ProductService.php`**File:** `app/Domain/Product/Services/ProductService.php`



```php```php

public function create(array $data) {public function create(array $data) {

    // ... tạo sản phẩm    // ... tạo sản phẩm

    $product->load(['brand', 'category', 'variants']);    $product->load(['brand', 'category', 'variants']);

    $this->eventProducer->publishEvent('created', $product->toArray());    $this->eventProducer->publishEvent('created', $product->toArray());

}}



public function update(string $slug, array $data) {public function update(string $slug, array $data) {

    // ... update sản phẩm    // ... update sản phẩm

    $product->load(['brand', 'category', 'variants']);    $product->load(['brand', 'category', 'variants']);

    $this->eventProducer->publishEvent('updated', $product->toArray());    $this->eventProducer->publishEvent('updated', $product->toArray());

}}



public function delete(string $slug) {public function delete(string $slug) {

    // ... xóa sản phẩm    // ... xóa sản phẩm

    $this->eventProducer->publishEvent('deleted', $product->toArray());    $this->eventProducer->publishEvent('deleted', $product->toArray());

}}

````

### Consumer Groups### Consumer Groups

#### 1. Audit Consumer#### 1. Audit Consumer

**File:** `app/Domain/Product/Services/Kafka/ProductAuditConsumer.php`**File:** `app/Domain/Product/Services/Kafka/ProductAuditConsumer.php`

-   Ghi log audit cho mọi product event- Ghi log audit cho mọi product event

-   Group ID: `product-audit-group`- Group ID: `product-audit-group`

-   Log file: `storage/logs/kafka-audit.log`- Log file: `storage/logs/kafka-audit.log`

#### 2. Cache Consumer#### 2. Cache Consumer

**File:** `app/Domain/Product/Services/Kafka/ProductCacheConsumer.php`**File:** `app/Domain/Product/Services/Kafka/ProductCacheConsumer.php`

-   Xóa cache khi product thay đổi- Xóa cache khi product thay đổi

-   Group ID: `product-cache-group`- Group ID: `product-cache-group`

-   Log file: `storage/logs/kafka-cache.log`- Log file: `storage/logs/kafka-cache.log`

#### 3. Elasticsearch Consumer#### 3. Elasticsearch Consumer

**File:** `app/Domain/Product/Services/Kafka/ProductElasticsearchConsumer.php`**File:** `app/Domain/Product/Services/Kafka/ProductElasticsearchConsumer.php`

-   Sync product to Elasticsearch với brand_name & category_name- Sync product to Elasticsearch với brand_name & category_name

-   Group ID: `product-elasticsearch-group`- Group ID: `product-elasticsearch-group`

-   Log file: `storage/logs/elasticsearch.log`- Log file: `storage/logs/elasticsearch.log`

---

## 🚀 KAFKA CONSUMERS## 🚀 KAFKA CONSUMERS

### Tổng quan 3 Consumer Groups### Tổng quan 3 Consumer Groups

| Consumer | Mục đích | Command | Group ID || Consumer | Mục đích | Command | Group ID |

| -------------------------- | ---------------- | ----------------------------- | --------------------------- || -------------------------- | ---------------- | ----------------------------- | --------------------------- |

| **Group 1: Audit** | Ghi audit logs | `product:kafka-audit` | product-audit-group || **Group 1: Audit** | Ghi audit logs | `product:kafka-audit` | product-audit-group |

| **Group 2: Cache** | Invalidate cache | `product:kafka-cache` | product-cache-group || **Group 2: Cache** | Invalidate cache | `product:kafka-cache` | product-cache-group |

| **Group 3: Elasticsearch** | Sync to ES | `product:kafka-elasticsearch` | product-elasticsearch-group || **Group 3: Elasticsearch** | Sync to ES | `product:kafka-elasticsearch` | product-elasticsearch-group |

### Cách 1: Chạy từ HOST (Khuyến nghị)### Cách 1: Chạy từ HOST (Khuyến nghị)

`bash`bash

# Vào thư mục src# Vào thư mục src

cd /Users/buimanhkhuong/Desktop/project/srccd /Users/buimanhkhuong/Desktop/project/src

# Start tất cả 3 consumers# Start tất cả 3 consumers

bash scripts/kafka-control.sh manualbash scripts/kafka-control.sh manual

# Check status# Check status

bash scripts/kafka-control.sh statusbash scripts/kafka-control.sh status

# Xem logs# Xem logs

bash scripts/kafka-control.sh logsbash scripts/kafka-control.sh logs

# Stop consumers# Stop consumers

bash scripts/kafka-control.sh stopbash scripts/kafka-control.sh stop

````



### Cách 2: Chạy TRONG container### Cách 2: Chạy TRONG container



```bash```bash

# Vào container# Vào container

docker exec -it laravel_php bashdocker exec -it laravel_php bash



# Vào thư mục scripts# Vào thư mục scripts

cd /var/www/html/scriptscd /var/www/html/scripts



# Start tất cả consumers# Start tất cả consumers

./kafka-control-internal.sh start./kafka-control-internal.sh start



# Check status# Check status

./kafka-control-internal.sh status./kafka-control-internal.sh status



# Xem logs# Xem logs

./kafka-control-internal.sh logs./kafka-control-internal.sh logs



# Stop consumers# Stop consumers

./kafka-control-internal.sh stop./kafka-control-internal.sh stop

````

### Cách 3: Artisan Commands trực tiếp### Cách 3: Artisan Commands trực tiếp

`bash`bash

# Start từng consumer riêng (background)# Start từng consumer riêng (background)

docker exec -d laravel_php php artisan product:kafka-auditdocker exec -d laravel_php php artisan product:kafka-audit

docker exec -d laravel_php php artisan product:kafka-cachedocker exec -d laravel_php php artisan product:kafka-cache

docker exec -d laravel_php php artisan product:kafka-elasticsearchdocker exec -d laravel_php php artisan product:kafka-elasticsearch

# Hoặc start trong foreground để xem logs real-time# Hoặc start trong foreground để xem logs real-time

docker exec -it laravel_php php artisan product:kafka-auditdocker exec -it laravel_php php artisan product:kafka-audit

````



### Cách 4: Supervisor (Tự động khởi động)### Cách 4: Supervisor (Tự động khởi động)



**File:** `docker-main/php/supervisord.conf`**File:** `docker-main/php/supervisord.conf`



```ini```ini

[program:kafka-product-audit][program:kafka-product-audit]

command=php /var/www/html/artisan product:kafka-auditcommand=php /var/www/html/artisan product:kafka-audit

autostart=trueautostart=true

autorestart=trueautorestart=true

stdout_logfile=/var/www/html/storage/logs/kafka-audit.logstdout_logfile=/var/www/html/storage/logs/kafka-audit.log

stderr_logfile=/var/www/html/storage/logs/kafka-audit-error.logstderr_logfile=/var/www/html/storage/logs/kafka-audit-error.log



[program:kafka-product-cache][program:kafka-product-cache]

command=php /var/www/html/artisan product:kafka-cachecommand=php /var/www/html/artisan product:kafka-cache

autostart=trueautostart=true

autorestart=trueautorestart=true

stdout_logfile=/var/www/html/storage/logs/kafka-cache.logstdout_logfile=/var/www/html/storage/logs/kafka-cache.log

stderr_logfile=/var/www/html/storage/logs/kafka-cache-error.logstderr_logfile=/var/www/html/storage/logs/kafka-cache-error.log



[program:kafka-product-elasticsearch][program:kafka-product-elasticsearch]

command=php /var/www/html/artisan product:kafka-elasticsearchcommand=php /var/www/html/artisan product:kafka-elasticsearch

autostart=trueautostart=true

autorestart=trueautorestart=true

stdout_logfile=/var/www/html/storage/logs/elasticsearch.logstdout_logfile=/var/www/html/storage/logs/elasticsearch.log

stderr_logfile=/var/www/html/storage/logs/elasticsearch-error.logstderr_logfile=/var/www/html/storage/logs/elasticsearch-error.log

````

**Quản lý Supervisor:\*\***Quản lý Supervisor:\*\*

`bash`bash

# Xem trạng thái# Xem trạng thái

docker exec laravel_queue supervisorctl statusdocker exec laravel_queue supervisorctl status

# Restart consumers# Restart consumers

docker exec laravel_queue supervisorctl restart kafka-product-audit kafka-product-cache kafka-product-elasticsearchdocker exec laravel_queue supervisorctl restart kafka-product-audit kafka-product-cache kafka-product-elasticsearch

# Stop consumers# Stop consumers

docker exec laravel_queue supervisorctl stop kafka-product-audit kafka-product-cache kafka-product-elasticsearchdocker exec laravel_queue supervisorctl stop kafka-product-audit kafka-product-cache kafka-product-elasticsearch

# Start consumers# Start consumers

docker exec laravel_queue supervisorctl start kafka-product-audit kafka-product-cache kafka-product-elasticsearchdocker exec laravel_queue supervisorctl start kafka-product-audit kafka-product-cache kafka-product-elasticsearch

````



------



## 🛠️ KAFKA CONTROL SCRIPTS## 🛠️ KAFKA CONTROL SCRIPTS



### Script từ HOST### Script từ HOST



**File:** `src/scripts/kafka-control.sh`**File:** `src/scripts/kafka-control.sh`



```bash```bash

# Start tất cả consumers (manual mode)# Start tất cả consumers (manual mode)

./scripts/kafka-control.sh manual./scripts/kafka-control.sh manual



# Stop tất cả consumers# Stop tất cả consumers

./scripts/kafka-control.sh stop./scripts/kafka-control.sh stop



# Restart tất cả consumers# Restart tất cả consumers

./scripts/kafka-control.sh restart./scripts/kafka-control.sh restart



# Check status# Check status

./scripts/kafka-control.sh status./scripts/kafka-control.sh status



# Test Elasticsearch connection# Test Elasticsearch connection

./scripts/kafka-control.sh test./scripts/kafka-control.sh test



# Xem logs (all consumers)# Xem logs (all consumers)

./scripts/kafka-control.sh logs./scripts/kafka-control.sh logs



# Initialize Elasticsearch index# Initialize Elasticsearch index

./scripts/kafka-control.sh init-es./scripts/kafka-control.sh init-es

````

### Script TRONG container### Script TRONG container

**File:** `src/scripts/kafka-control-internal.sh`**File:** `src/scripts/kafka-control-internal.sh`

`bash`bash

# Vào container# Vào container

docker exec -it laravel_php bashdocker exec -it laravel_php bash

# Start consumers# Start consumers

./scripts/kafka-control-internal.sh start./scripts/kafka-control-internal.sh start

# Stop consumers# Stop consumers

./scripts/kafka-control-internal.sh stop./scripts/kafka-control-internal.sh stop

# Status# Status

./scripts/kafka-control-internal.sh status./scripts/kafka-control-internal.sh status

# Logs# Logs

./scripts/kafka-control-internal.sh logs./scripts/kafka-control-internal.sh logs

````



### Kiểm tra Consumers đang chạy### Kiểm tra Consumers đang chạy



```bash```bash

# Check processes# Check processes

docker exec laravel_php ps aux | grep kafkadocker exec laravel_php ps aux | grep kafka



# Check Docker logs# Check Docker logs

docker logs -f laravel_phpdocker logs -f laravel_php



# Check specific logs# Check specific logs

docker exec laravel_php tail -f /var/www/html/storage/logs/kafka-audit.logdocker exec laravel_php tail -f /var/www/html/storage/logs/kafka-audit.log

docker exec laravel_php tail -f /var/www/html/storage/logs/kafka-cache.logdocker exec laravel_php tail -f /var/www/html/storage/logs/kafka-cache.log

docker exec laravel_php tail -f /var/www/html/storage/logs/elasticsearch.logdocker exec laravel_php tail -f /var/www/html/storage/logs/elasticsearch.log

docker exec laravel_php tail -f /var/www/html/app/Domain/Product/storage/logs/product.logdocker exec laravel_php tail -f /var/www/html/app/Domain/Product/storage/logs/product.log

````

---

## 📊 GIÁM SÁT KAFKA BẰNG KIBANA## 📊 GIÁM SÁT KAFKA BẰNG KIBANA

### Tổng quan### Tổng quan

Có **2 cách** giám sát Kafka qua Kibana:Có **2 cách** giám sát Kafka qua Kibana:

#### ✅ Cách 1: Kafka Messages → Logstash → Elasticsearch → Kibana#### ✅ Cách 1: Kafka Messages → Logstash → Elasticsearch → Kibana

**Giám sát:** Messages/Events trong Kafka topics (ĐÃ CÀI)**Giám sát:** Messages/Events trong Kafka topics (ĐÃ CÀI)

#### ⚙️ Cách 2: Metricbeat → Elasticsearch → Kibana#### ⚙️ Cách 2: Metricbeat → Elasticsearch → Kibana

**Giám sát:** Kafka metrics (broker health, performance)**Giám sát:** Kafka metrics (broker health, performance)

### Cấu hình Logstash (Đã cài)### Cấu hình Logstash (Đã cài)

**File:** `docker-main/logstash/pipeline/logstash.conf`**File:** `docker-main/logstash/pipeline/logstash.conf`

`properties`properties

input {input {

# Kafka input - Monitor Kafka topics # Kafka input - Monitor Kafka topics

kafka { kafka {

    bootstrap_servers => "kafka:9092"    bootstrap_servers => "kafka:9092"

    topics => ["product-events", "order-events", "user-events"]    topics => ["product-events", "order-events", "user-events"]

    codec => json    codec => json

    group_id => "logstash-consumer-group"    group_id => "logstash-consumer-group"

    consumer_threads => 1    consumer_threads => 1

    tags => ["kafka"]    tags => ["kafka"]

} }

}}

filter {filter {

# Parse Kafka messages # Parse Kafka messages

if "kafka" in [tags] { if "kafka" in [tags] {

    mutate {    mutate {

      add_field => {      add_field => {

        "source_type" => "kafka"        "source_type" => "kafka"

        "kafka_topic" => "%{[@metadata][kafka][topic]}"        "kafka_topic" => "%{[@metadata][kafka][topic]}"

        "kafka_partition" => "%{[@metadata][kafka][partition]}"        "kafka_partition" => "%{[@metadata][kafka][partition]}"

        "kafka_offset" => "%{[@metadata][kafka][offset]}"        "kafka_offset" => "%{[@metadata][kafka][offset]}"

      }      }

    }    }

} }

}}

output {output {

# Kafka messages to topic-based indices # Kafka messages to topic-based indices

if "kafka" in [tags] { if "kafka" in [tags] {

    elasticsearch {    elasticsearch {

      hosts => ["http://elasticsearch:9200"]      hosts => ["http://elasticsearch:9200"]

      user => "logstash_system"      user => "logstash_system"

      password => "rkHfzksj64jRlkfnRuNs"      password => "rkHfzksj64jRlkfnRuNs"

      index => "kafka-%{kafka_topic}-%{+YYYY.MM.dd}"      index => "kafka-%{kafka_topic}-%{+YYYY.MM.dd}"

      document_type => "_doc"      document_type => "_doc"

    }    }

} }

}}

```



### Luồng dữ liệu### Luồng dữ liệu



```

Laravel AppLaravel App

    ↓ (Produce messages)    ↓ (Produce messages)

Kafka Topics:Kafka Topics:

├── product-events├── product-events

├── order-events├── order-events

└── user-events└── user-events

    ↓ (Logstash consumes)    ↓ (Logstash consumes)

Logstash ProcessingLogstash Processing

    ↓ (Index to Elasticsearch)    ↓ (Index to Elasticsearch)

Elasticsearch Indices:Elasticsearch Indices:

├── kafka-product-events-2025.10.18├── kafka-product-events-2025.10.18

├── kafka-order-events-2025.10.18├── kafka-order-events-2025.10.18

└── kafka-user-events-2025.10.18└── kafka-user-events-2025.10.18

    ↓ (Visualize)    ↓ (Visualize)

Kibana DashboardKibana Dashboard

````



### Test Kafka Monitoring### Test Kafka Monitoring



#### 1. Gửi test message vào Kafka#### 1. Gửi test message vào Kafka



```bash```bash

# Vào container Kafka# Vào container Kafka

docker exec -it laravel_kafka bashdocker exec -it laravel_kafka bash



# Gửi message vào topic product-events# Gửi message vào topic product-events

kafka-console-producer --bootstrap-server localhost:9092 --topic product-eventskafka-console-producer --bootstrap-server localhost:9092 --topic product-events



# Paste JSON này rồi Enter:# Paste JSON này rồi Enter:

{"event":"product.created","product_id":12345,"name":"iPhone 15","price":999,"timestamp":"2025-10-18T10:00:00Z"}{"event":"product.created","product_id":12345,"name":"iPhone 15","price":999,"timestamp":"2025-10-18T10:00:00Z"}



# Ctrl+C để thoát# Ctrl+C để thoát

````

#### 2. Kiểm tra Elasticsearch#### 2. Kiểm tra Elasticsearch

`bash`bash

# Xem indices Kafka# Xem indices Kafka

curl -s "http://localhost:9200/\_cat/indices/kafka-_?v"curl -s "http://localhost:9200/\_cat/indices/kafka-_?v"

# Xem messages (với auth)# Xem messages (với auth)

curl -u elastic:msWrVIxIVyrLgXPwfZj4 "http://localhost:9200/kafka-product-events-_/\_search?pretty&size=5"curl -u elastic:msWrVIxIVyrLgXPwfZj4 "http://localhost:9200/kafka-product-events-_/\_search?pretty&size=5"

````



#### 3. Xem trong Kibana#### 3. Xem trong Kibana



1. **Tạo Index Pattern:**1. **Tạo Index Pattern:**



    - Stack Management → Index Patterns    - Stack Management → Index Patterns

    - Create: `kafka-*`    - Create: `kafka-*`

    - Time field: `@timestamp`    - Time field: `@timestamp`



2. **Xem trong Discover:**2. **Xem trong Discover:**

    - Select index pattern: `kafka-*`    - Select index pattern: `kafka-*`

    - Filter by: `kafka_topic: "product-events"`    - Filter by: `kafka_topic: "product-events"`



### Tạo Kafka Dashboard trong Kibana### Tạo Kafka Dashboard trong Kibana



#### Dashboard 1: Kafka Message Flow#### Dashboard 1: Kafka Message Flow



**Visualizations:****Visualizations:**



1. **Messages per Topic (Bar chart)**1. **Messages per Topic (Bar chart)**



    - Metrics: Count    - Metrics: Count

    - Buckets: Terms → kafka_topic.keyword    - Buckets: Terms → kafka_topic.keyword



2. **Messages Timeline (Line chart)**2. **Messages Timeline (Line chart)**



    - Y-axis: Count    - Y-axis: Count

    - X-axis: @timestamp (date histogram)    - X-axis: @timestamp (date histogram)

    - Split series: kafka_topic.keyword    - Split series: kafka_topic.keyword



3. **Latest Messages (Data table)**3. **Latest Messages (Data table)**

    - Columns: @timestamp, kafka_topic, kafka_partition, message    - Columns: @timestamp, kafka_topic, kafka_partition, message



#### Dashboard 2: Kafka Performance#### Dashboard 2: Kafka Performance



**Visualizations:****Visualizations:**



1. **Messages per Partition (Pie chart)**1. **Messages per Partition (Pie chart)**



    - Slice size: Count    - Slice size: Count

    - Split slices: kafka_partition    - Split slices: kafka_partition



2. **Offset Progress (Metric)**2. **Offset Progress (Metric)**

    - Aggregation: Max    - Aggregation: Max

    - Field: kafka_offset    - Field: kafka_offset



### Cài đặt Metricbeat (Optional)### Cài đặt Metricbeat (Optional)



#### Thêm vào docker-compose.yml#### Thêm vào docker-compose.yml



```yaml```yaml

services:services:

    metricbeat:    metricbeat:

        image: docker.elastic.co/beats/metricbeat:8.8.2        image: docker.elastic.co/beats/metricbeat:8.8.2

        container_name: laravel_metricbeat        container_name: laravel_metricbeat

        restart: unless-stopped        restart: unless-stopped

        user: root        user: root

        environment:        environment:

            - ELASTICSEARCH_HOSTS=http://elasticsearch:9200            - ELASTICSEARCH_HOSTS=http://elasticsearch:9200

            - ELASTICSEARCH_USERNAME=elastic            - ELASTICSEARCH_USERNAME=elastic

            - ELASTICSEARCH_PASSWORD=msWrVIxIVyrLgXPwfZj4            - ELASTICSEARCH_PASSWORD=msWrVIxIVyrLgXPwfZj4

            - KIBANA_HOST=http://kibana:5601            - KIBANA_HOST=http://kibana:5601

        volumes:        volumes:

            - ./metricbeat/metricbeat.yml:/usr/share/metricbeat/metricbeat.yml:ro            - ./metricbeat/metricbeat.yml:/usr/share/metricbeat/metricbeat.yml:ro

            - /var/run/docker.sock:/var/run/docker.sock:ro            - /var/run/docker.sock:/var/run/docker.sock:ro

            - /sys/fs/cgroup:/hostfs/sys/fs/cgroup:ro            - /sys/fs/cgroup:/hostfs/sys/fs/cgroup:ro

            - /proc:/hostfs/proc:ro            - /proc:/hostfs/proc:ro

            - /:/hostfs:ro            - /:/hostfs:ro

        command: metricbeat -e -strict.perms=false        command: metricbeat -e -strict.perms=false

        depends_on:        depends_on:

            - elasticsearch            - elasticsearch

            - kafka            - kafka

        networks:        networks:

            - laravel            - laravel

````

#### Tạo metricbeat.yml#### Tạo metricbeat.yml

`bash`bash

mkdir -p docker-main/metricbeatmkdir -p docker-main/metricbeat

````



**File:** `docker-main/metricbeat/metricbeat.yml`**File:** `docker-main/metricbeat/metricbeat.yml`



```yaml```yaml

metricbeat.modules:metricbeat.modules:

    # Kafka module    # Kafka module

    - module: kafka    - module: kafka

      metricsets:      metricsets:

          - partition          - partition

          - consumergroup          - consumergroup

      period: 10s      period: 10s

      hosts: ['kafka:9092']      hosts: ['kafka:9092']



    # Docker module (optional)    # Docker module (optional)

    - module: docker    - module: docker

      metricsets:      metricsets:

          - container          - container

          - cpu          - cpu

          - diskio          - diskio

          - memory          - memory

          - network          - network

      hosts: ['unix:///var/run/docker.sock']      hosts: ['unix:///var/run/docker.sock']

      period: 10s      period: 10s



output.elasticsearch:output.elasticsearch:

    hosts: ['http://elasticsearch:9200']    hosts: ['http://elasticsearch:9200']

    username: 'elastic'    username: 'elastic'

    password: 'msWrVIxIVyrLgXPwfZj4'    password: 'msWrVIxIVyrLgXPwfZj4'

    index: 'metricbeat-kafka-%{+yyyy.MM.dd}'    index: 'metricbeat-kafka-%{+yyyy.MM.dd}'



setup.kibana:setup.kibana:

    host: 'http://kibana:5601'    host: 'http://kibana:5601'



setup.dashboards.enabled: truesetup.dashboards.enabled: true

````

#### Khởi động Metricbeat#### Khởi động Metricbeat

`bash`bash

cd docker-maincd docker-main

docker-compose up -d metricbeatdocker-compose up -d metricbeat

````



#### Xem Kafka Metrics trong Kibana#### Xem Kafka Metrics trong Kibana



1. **Auto-imported Dashboards:**1. **Auto-imported Dashboards:**



    - Dashboard → Search "Kafka"    - Dashboard → Search "Kafka"

    - Sẽ có sẵn:    - Sẽ có sẵn:

        - [Metricbeat Kafka] Overview        - [Metricbeat Kafka] Overview

        - [Metricbeat Kafka] Consumer Overview        - [Metricbeat Kafka] Consumer Overview



2. **Metrics bao gồm:**2. **Metrics bao gồm:**

    - Broker status    - Broker status

    - Topic partitions    - Topic partitions

    - Consumer lag    - Consumer lag

    - Message rate    - Message rate

    - Throughput    - Throughput



### So sánh 2 cách giám sát### So sánh 2 cách giám sát



| Tiêu chí     | Cách 1: Logstash  | Cách 2: Metricbeat     || Tiêu chí     | Cách 1: Logstash  | Cách 2: Metricbeat     |

| ------------ | ----------------- | ---------------------- || ------------ | ----------------- | ---------------------- |

| **Giám sát** | Messages/Events   | Metrics/Performance    || **Giám sát** | Messages/Events   | Metrics/Performance    |

| **Data**     | Message content   | Broker stats           || **Data**     | Message content   | Broker stats           |

| **Use case** | Debug, audit logs | Performance monitoring || **Use case** | Debug, audit logs | Performance monitoring |

| **Setup**    | ✅ Đã cài         | ⏳ Chưa cài            || **Setup**    | ✅ Đã cài         | ⏳ Chưa cài            |

| **Indices**  | `kafka-{topic}-*` | `metricbeat-kafka-*`   || **Indices**  | `kafka-{topic}-*` | `metricbeat-kafka-*`   |



------



## 🛠️ COMMANDS & QUẢN LÝ## 🛠️ COMMANDS & QUẢN LÝ



### Topic Management### Topic Management



```bash```bash

# Tạo topic (one-time setup)# Tạo topic (one-time setup)

docker exec laravel_kafka kafka-topics --create \docker exec laravel_kafka kafka-topics --create \

  --topic product_events \  --topic product_events \

  --bootstrap-server localhost:9092 \  --bootstrap-server localhost:9092 \

  --partitions 3 \  --partitions 3 \

  --replication-factor 1  --replication-factor 1



# Hoặc dùng artisan command# Hoặc dùng artisan command

docker exec laravel_php php artisan product:kafka-create-topicdocker exec laravel_php php artisan product:kafka-create-topic



# List tất cả topics# List tất cả topics

docker exec laravel_kafka kafka-topics --list \docker exec laravel_kafka kafka-topics --list \

  --bootstrap-server localhost:9092  --bootstrap-server localhost:9092



# Describe topic# Describe topic

docker exec laravel_kafka kafka-topics \docker exec laravel_kafka kafka-topics \

  --describe \  --describe \

  --topic product_events \  --topic product_events \

  --bootstrap-server localhost:9092  --bootstrap-server localhost:9092



# Delete topic# Delete topic

docker exec laravel_kafka kafka-topics --delete \docker exec laravel_kafka kafka-topics --delete \

  --topic product_events \  --topic product_events \

  --bootstrap-server localhost:9092  --bootstrap-server localhost:9092

````

### Consumer Groups Management### Consumer Groups Management

`bash`bash

# List consumer groups# List consumer groups

docker exec laravel_kafka kafka-consumer-groups \docker exec laravel_kafka kafka-consumer-groups \

--bootstrap-server localhost:9092 \ --bootstrap-server localhost:9092 \

--list --list

# Describe consumer group (check lag)# Describe consumer group (check lag)

docker exec laravel_kafka kafka-consumer-groups \docker exec laravel_kafka kafka-consumer-groups \

--bootstrap-server localhost:9092 \ --bootstrap-server localhost:9092 \

--group product-audit-group \ --group product-audit-group \

--describe --describe

docker exec laravel_kafka kafka-consumer-groups \docker exec laravel_kafka kafka-consumer-groups \

--bootstrap-server localhost:9092 \ --bootstrap-server localhost:9092 \

--group product-cache-group \ --group product-cache-group \

--describe --describe

docker exec laravel_kafka kafka-consumer-groups \docker exec laravel_kafka kafka-consumer-groups \

--bootstrap-server localhost:9092 \ --bootstrap-server localhost:9092 \

--group product-elasticsearch-group \ --group product-elasticsearch-group \

--describe --describe

# Reset consumer group offset# Reset consumer group offset

docker exec laravel_kafka kafka-consumer-groups \docker exec laravel_kafka kafka-consumer-groups \

--bootstrap-server localhost:9092 \ --bootstrap-server localhost:9092 \

--group product-audit-group \ --group product-audit-group \

--reset-offsets \ --reset-offsets \

--to-earliest \ --to-earliest \

--topic product_events \ --topic product_events \

--execute --execute

````



### Messages Management### Messages Management



```bash```bash

# Read messages từ topic# Read messages từ topic

docker exec laravel_kafka kafka-console-consumer \docker exec laravel_kafka kafka-console-consumer \

  --bootstrap-server localhost:9092 \  --bootstrap-server localhost:9092 \

  --topic product_events \  --topic product_events \

  --from-beginning \  --from-beginning \

  --max-messages 10  --max-messages 10



# Produce test message# Produce test message

docker exec -it laravel_kafka kafka-console-producer \docker exec -it laravel_kafka kafka-console-producer \

  --bootstrap-server localhost:9092 \  --bootstrap-server localhost:9092 \

  --topic product_events  --topic product_events

# Paste JSON và Enter, Ctrl+C để exit# Paste JSON và Enter, Ctrl+C để exit



# Count messages trong topic (gần đúng)# Count messages trong topic (gần đúng)

docker exec laravel_kafka kafka-run-class kafka.tools.GetOffsetShell \docker exec laravel_kafka kafka-run-class kafka.tools.GetOffsetShell \

  --broker-list localhost:9092 \  --broker-list localhost:9092 \

  --topic product_events  --topic product_events

````

### Logs & Monitoring### Logs & Monitoring

`bash`bash

# Xem logs của Kafka broker# Xem logs của Kafka broker

docker logs laravel_kafka --tail 50docker logs laravel_kafka --tail 50

# Xem logs của Zookeeper# Xem logs của Zookeeper

docker logs laravel_zookeeper --tail 50docker logs laravel_zookeeper --tail 50

# Xem logs consumers# Xem logs consumers

docker exec laravel_php tail -f storage/logs/kafka-audit.logdocker exec laravel_php tail -f storage/logs/kafka-audit.log

docker exec laravel_php tail -f storage/logs/kafka-cache.logdocker exec laravel_php tail -f storage/logs/kafka-cache.log

docker exec laravel_php tail -f storage/logs/elasticsearch.logdocker exec laravel_php tail -f storage/logs/elasticsearch.log

# Xem product logs# Xem product logs

docker exec laravel_php tail -f app/Domain/Product/storage/logs/product.logdocker exec laravel_php tail -f app/Domain/Product/storage/logs/product.log

````



### Health Checks### Health Checks



```bash```bash

# Check Kafka broker# Check Kafka broker

docker exec laravel_kafka kafka-broker-api-versions \docker exec laravel_kafka kafka-broker-api-versions \

  --bootstrap-server localhost:9092  --bootstrap-server localhost:9092



# Check Zookeeper# Check Zookeeper

echo ruok | docker exec -i laravel_zookeeper nc localhost 2181echo ruok | docker exec -i laravel_zookeeper nc localhost 2181



# Check consumers đang chạy# Check consumers đang chạy

docker exec laravel_php ps aux | grep "kafka"docker exec laravel_php ps aux | grep "kafka"

````

---

## 🧪 TEST KAFKA FLOW## 🧪 TEST KAFKA FLOW

### Test toàn bộ flow### Test toàn bộ flow

`bash`bash

# 1. Start consumers# 1. Start consumers

bash scripts/kafka-control.sh manualbash scripts/kafka-control.sh manual

# 2. Tạo product mới qua API# 2. Tạo product mới qua API

curl -X POST "http://localhost/api/v1/products" \curl -X POST "http://localhost/api/v1/products" \

-H "Content-Type: application/json" \ -H "Content-Type: application/json" \

-d '{ -d '{

    "product": {    "product": {

      "name": "Test Kafka Product",      "name": "Test Kafka Product",

      "brand_id": 1,      "brand_id": 1,

      "category_id": 1,      "category_id": 1,

      "is_active": true      "is_active": true

    },    },

    "product_variant": {    "product_variant": {

      "name": "Variant 1",      "name": "Variant 1",

      "config": [{      "config": [{

        "color": "red",        "color": "red",

        "size": "M",        "size": "M",

        "price": 1000,        "price": 1000,

        "stock": 10,        "stock": 10,

        "is_active": true        "is_active": true

      }]      }]

    }    }

}' }'

# 3. Check Kafka message# 3. Check Kafka message

docker exec laravel_kafka kafka-console-consumer \docker exec laravel_kafka kafka-console-consumer \

--bootstrap-server localhost:9092 \ --bootstrap-server localhost:9092 \

--topic product_events \ --topic product_events \

--max-messages 1 \ --max-messages 1 \

--from-beginning --from-beginning

# 4. Check logs của 3 consumers# 4. Check logs của 3 consumers

docker exec laravel_php tail -5 storage/logs/kafka-audit.logdocker exec laravel_php tail -5 storage/logs/kafka-audit.log

docker exec laravel_php tail -5 storage/logs/kafka-cache.logdocker exec laravel_php tail -5 storage/logs/kafka-cache.log

docker exec laravel_php tail -5 storage/logs/elasticsearch.logdocker exec laravel_php tail -5 storage/logs/elasticsearch.log

# 5. Verify trong Elasticsearch# 5. Verify trong Elasticsearch

curl -u elastic:msWrVIxIVyrLgXPwfZj4 \curl -u elastic:msWrVIxIVyrLgXPwfZj4 \

"http://localhost:9200/products/\_search?q=Test+Kafka&pretty" "http://localhost:9200/products/\_search?q=Test+Kafka&pretty"

# 6. Check consumer group lag# 6. Check consumer group lag

docker exec laravel_kafka kafka-consumer-groups \docker exec laravel_kafka kafka-consumer-groups \

--bootstrap-server localhost:9092 \ --bootstrap-server localhost:9092 \

--group product-elasticsearch-group \ --group product-elasticsearch-group \

--describe --describe

````



------



## 🐛 TROUBLESHOOTING## 🐛 TROUBLESHOOTING



### 1. Topic not available### 1. Topic not available



**Triệu chứng:** Producer/Consumer không tìm thấy topic**Triệu chứng:** Producer/Consumer không tìm thấy topic



**Giải pháp:****Giải pháp:**



```bash```bash

# Tạo topic# Tạo topic

docker exec laravel_kafka kafka-topics --create \docker exec laravel_kafka kafka-topics --create \

  --topic product_events \  --topic product_events \

  --bootstrap-server localhost:9092 \  --bootstrap-server localhost:9092 \

  --partitions 3 \  --partitions 3 \

  --replication-factor 1  --replication-factor 1



# Restart Kafka# Restart Kafka

docker-compose restart kafkadocker-compose restart kafka



# Restart consumers# Restart consumers

docker exec laravel_queue supervisorctl restart kafka-product-audit kafka-product-cache kafka-product-elasticsearchdocker exec laravel_queue supervisorctl restart kafka-product-audit kafka-product-cache kafka-product-elasticsearch

````

### 2. Connection refused### 2. Connection refused

**Triệu chứng:** Cannot connect to Kafka broker**Triệu chứng:** Cannot connect to Kafka broker

**Giải pháp:\*\***Giải pháp:\*\*

`bash`bash

# Check Kafka container# Check Kafka container

docker ps | grep kafkadocker ps | grep kafka

# Check logs# Check logs

docker logs laravel_kafka --tail 50docker logs laravel_kafka --tail 50

# Restart Kafka & Zookeeper# Restart Kafka & Zookeeper

docker-compose restart zookeeper kafkadocker-compose restart zookeeper kafka

# Wait 10 seconds# Wait 10 seconds

sleep 10sleep 10

# Test connection# Test connection

docker exec laravel_kafka kafka-broker-api-versions \docker exec laravel_kafka kafka-broker-api-versions \

--bootstrap-server localhost:9092 --bootstrap-server localhost:9092

````



### 3. Consumer lag cao### 3. Consumer lag cao



**Triệu chứng:** Consumer group có lag lớn, không xử lý kịp messages**Triệu chứng:** Consumer group có lag lớn, không xử lý kịp messages



**Giải pháp:****Giải pháp:**



```bash```bash

# Check lag# Check lag

docker exec laravel_kafka kafka-consumer-groups \docker exec laravel_kafka kafka-consumer-groups \

  --bootstrap-server localhost:9092 \  --bootstrap-server localhost:9092 \

  --group product-audit-group \  --group product-audit-group \

  --describe  --describe



# Restart consumer# Restart consumer

docker exec laravel_queue supervisorctl restart kafka-product-auditdocker exec laravel_queue supervisorctl restart kafka-product-audit



# Hoặc scale up consumers (chạy nhiều instances)# Hoặc scale up consumers (chạy nhiều instances)

docker exec -d laravel_php php artisan product:kafka-auditdocker exec -d laravel_php php artisan product:kafka-audit

docker exec -d laravel_php php artisan product:kafka-auditdocker exec -d laravel_php php artisan product:kafka-audit

````

### 4. Consumers không chạy### 4. Consumers không chạy

**Triệu chứng:** No active members in consumer group**Triệu chứng:** No active members in consumer group

**Giải pháp:\*\***Giải pháp:\*\*

`bash`bash

# 1. Check Kafka broker# 1. Check Kafka broker

docker exec laravel_kafka kafka-broker-api-versions \docker exec laravel_kafka kafka-broker-api-versions \

--bootstrap-server localhost:9092 --bootstrap-server localhost:9092

# 2. Check topic tồn tại# 2. Check topic tồn tại

docker exec laravel_kafka kafka-topics --list \docker exec laravel_kafka kafka-topics --list \

--bootstrap-server localhost:9092 --bootstrap-server localhost:9092

# 3. Check consumer groups# 3. Check consumer groups

docker exec laravel_kafka kafka-consumer-groups --list \docker exec laravel_kafka kafka-consumer-groups --list \

--bootstrap-server localhost:9092 --bootstrap-server localhost:9092

# 4. Clear config cache# 4. Clear config cache

docker exec laravel_php php artisan config:cleardocker exec laravel_php php artisan config:clear

# 5. Restart PHP container# 5. Restart PHP container

docker-compose restart phpdocker-compose restart php

# 6. Start consumers manually# 6. Start consumers manually

bash scripts/kafka-control.sh manualbash scripts/kafka-control.sh manual

````



### 5. Consumers crash ngay sau khi start### 5. Consumers crash ngay sau khi start



**Triệu chứng:** Consumer starts then immediately exits**Triệu chứng:** Consumer starts then immediately exits



**Giải pháp:****Giải pháp:**



```bash```bash

# Check PHP errors# Check PHP errors

docker logs laravel_php --tail 50docker logs laravel_php --tail 50



# Check artisan command output (verbose)# Check artisan command output (verbose)

docker exec laravel_php php artisan product:kafka-audit -vvvdocker exec laravel_php php artisan product:kafka-audit -vvv



# Check PHP memory limit# Check PHP memory limit

docker exec laravel_php php -i | grep memory_limitdocker exec laravel_php php -i | grep memory_limit



# Check Kafka client config# Check Kafka client config

docker exec laravel_php php artisan config:show kafkadocker exec laravel_php php artisan config:show kafka

````

### 6. Messages không được index vào Elasticsearch### 6. Messages không được index vào Elasticsearch

**Triệu chứng:** Kafka có messages nhưng Elasticsearch empty**Triệu chứng:** Kafka có messages nhưng Elasticsearch empty

**Giải pháp:\*\***Giải pháp:\*\*

`bash`bash

# 1. Check Elasticsearch consumer running# 1. Check Elasticsearch consumer running

docker exec laravel_php ps aux | grep "kafka-elasticsearch"docker exec laravel_php ps aux | grep "kafka-elasticsearch"

# 2. Check ES consumer logs# 2. Check ES consumer logs

docker exec laravel_php tail -50 storage/logs/elasticsearch.logdocker exec laravel_php tail -50 storage/logs/elasticsearch.log

# 3. Test ES connection# 3. Test ES connection

curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200

# 4. Check ES index exists# 4. Check ES index exists

curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200/productscurl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200/products

# 5. Recreate index# 5. Recreate index

docker exec laravel_php php artisan product:es-initdocker exec laravel_php php artisan product:es-init

# 6. Restart ES consumer# 6. Restart ES consumer

bash scripts/kafka-control.sh restartbash scripts/kafka-control.sh restart

````



### 7. Không thấy messages trong Kibana (Logstash)### 7. Không thấy messages trong Kibana (Logstash)



**Triệu chứng:** Logstash running nhưng không thấy data trong Kibana**Triệu chứng:** Logstash running nhưng không thấy data trong Kibana



**Giải pháp:****Giải pháp:**



```bash```bash

# 1. Check Logstash subscribed topics# 1. Check Logstash subscribed topics

docker logs laravel_logstash | grep "Subscribed to topic"docker logs laravel_logstash | grep "Subscribed to topic"



# 2. Check Kafka topics có data# 2. Check Kafka topics có data

docker exec laravel_kafka kafka-console-consumer \docker exec laravel_kafka kafka-console-consumer \

  --bootstrap-server localhost:9092 \  --bootstrap-server localhost:9092 \

  --topic product-events \  --topic product-events \

  --from-beginning \  --from-beginning \

  --max-messages 5  --max-messages 5



# 3. Check Elasticsearch indices# 3. Check Elasticsearch indices

curl -u elastic:msWrVIxIVyrLgXPwfZj4 \curl -u elastic:msWrVIxIVyrLgXPwfZj4 \

  "http://localhost:9200/_cat/indices/kafka-*?v"  "http://localhost:9200/_cat/indices/kafka-*?v"



# 4. Restart Logstash# 4. Restart Logstash

docker-compose restart logstashdocker-compose restart logstash



# 5. Wait 30 seconds then check again# 5. Wait 30 seconds then check again

sleep 30sleep 30

curl -u elastic:msWrVIxIVyrLgXPwfZj4 \curl -u elastic:msWrVIxIVyrLgXPwfZj4 \

  "http://localhost:9200/kafka-product-events-*/_count"  "http://localhost:9200/kafka-product-events-*/_count"

````

### 8. Zookeeper connection issues### 8. Zookeeper connection issues

**Triệu chứng:** Kafka cannot connect to Zookeeper**Triệu chứng:** Kafka cannot connect to Zookeeper

**Giải pháp:\*\***Giải pháp:\*\*

`bash`bash

# Check Zookeeper health# Check Zookeeper health

echo ruok | docker exec -i laravel_zookeeper nc localhost 2181echo ruok | docker exec -i laravel_zookeeper nc localhost 2181

# Expected output: imok# Expected output: imok

# Restart Zookeeper then Kafka# Restart Zookeeper then Kafka

docker-compose restart zookeeperdocker-compose restart zookeeper

sleep 5sleep 5

docker-compose restart kafkadocker-compose restart kafka

sleep 10sleep 10

# Verify Kafka connected# Verify Kafka connected

docker logs laravel_kafka | grep -i "zookeeper"docker logs laravel_kafka | grep -i "zookeeper"

````



### 9. Partition assignment issues### 9. Partition assignment issues



**Triệu chứng:** Consumer group rebalancing continuously**Triệu chứng:** Consumer group rebalancing continuously



**Giải pháp:****Giải pháp:**



```bash```bash

# Check consumer group# Check consumer group

docker exec laravel_kafka kafka-consumer-groups \docker exec laravel_kafka kafka-consumer-groups \

  --bootstrap-server localhost:9092 \  --bootstrap-server localhost:9092 \

  --group product-audit-group \  --group product-audit-group \

  --describe  --describe



# Stop all consumers# Stop all consumers

bash scripts/kafka-control.sh stopbash scripts/kafka-control.sh stop



# Wait 10 seconds# Wait 10 seconds

sleep 10sleep 10



# Start again# Start again

bash scripts/kafka-control.sh manualbash scripts/kafka-control.sh manual



# Verify assignment stable# Verify assignment stable

docker exec laravel_kafka kafka-consumer-groups \docker exec laravel_kafka kafka-consumer-groups \

  --bootstrap-server localhost:9092 \  --bootstrap-server localhost:9092 \

  --group product-audit-group \  --group product-audit-group \

  --describe  --describe

````

### 10. Out of memory errors### 10. Out of memory errors

**Triệu chứng:** Kafka crashes with OOM**Triệu chứng:** Kafka crashes with OOM

**Giải pháp:\*\***Giải pháp:\*\*

`yaml`yaml

# Trong docker-compose.yml, increase Kafka memory# Trong docker-compose.yml, increase Kafka memory

kafka:kafka:

    environment:    environment:

        - KAFKA_HEAP_OPTS=-Xmx1G -Xms1G # Tăng từ 512M        - KAFKA_HEAP_OPTS=-Xmx1G -Xms1G # Tăng từ 512M

````



------



## 📝 CẤU HÌNH## 📝 CẤU HÌNH



### config/kafka.php### config/kafka.php



```php```php

<?php<?php



return [return [

    'bootstrap_servers' => env('KAFKA_BOOTSTRAP_SERVERS', 'kafka:9092'),    'bootstrap_servers' => env('KAFKA_BOOTSTRAP_SERVERS', 'kafka:9092'),



    'topics' => [    'topics' => [

        'product_events' => env('KAFKA_TOPIC_PRODUCT_EVENTS', 'product_events'),        'product_events' => env('KAFKA_TOPIC_PRODUCT_EVENTS', 'product_events'),

        'order_events' => env('KAFKA_TOPIC_ORDER_EVENTS', 'order_events'),        'order_events' => env('KAFKA_TOPIC_ORDER_EVENTS', 'order_events'),

        'user_events' => env('KAFKA_TOPIC_USER_EVENTS', 'user_events'),        'user_events' => env('KAFKA_TOPIC_USER_EVENTS', 'user_events'),

    ],    ],



    'consumer' => [    'consumer' => [

        'audit_group' => 'product-audit-group',        'audit_group' => 'product-audit-group',

        'cache_group' => 'product-cache-group',        'cache_group' => 'product-cache-group',

        'elasticsearch_group' => 'product-elasticsearch-group',        'elasticsearch_group' => 'product-elasticsearch-group',

    ],    ],



    'producer' => [    'producer' => [

        'timeout' => 1000,        'timeout' => 1000,

        'retries' => 3,        'retries' => 3,

    ],    ],

];];

````

### .env### .env

`bash`bash

KAFKA_BOOTSTRAP_SERVERS=kafka:9092KAFKA_BOOTSTRAP_SERVERS=kafka:9092

KAFKA_TOPIC_PRODUCT_EVENTS=product_eventsKAFKA_TOPIC_PRODUCT_EVENTS=product_events

KAFKA_TOPIC_ORDER_EVENTS=order_eventsKAFKA_TOPIC_ORDER_EVENTS=order_events

KAFKA_TOPIC_USER_EVENTS=user_eventsKAFKA_TOPIC_USER_EVENTS=user_events

```



------



## 🎯 CHECKLIST## 🎯 CHECKLIST



-   [x] Kafka broker đang chạy-   [x] Kafka broker đang chạy

-   [x] Zookeeper đang chạy-   [x] Zookeeper đang chạy

-   [x] Topics được tạo (product_events)-   [x] Topics được tạo (product_events)

-   [x] Producer tích hợp trong ProductService-   [x] Producer tích hợp trong ProductService

-   [x] 3 Consumers (Audit + Cache + Elasticsearch)-   [x] 3 Consumers (Audit + Cache + Elasticsearch)

-   [x] Commands đăng ký trong ProductServiceProvider-   [x] Commands đăng ký trong ProductServiceProvider

-   [x] Supervisor config autostart (optional)-   [x] Supervisor config autostart (optional)

-   [x] Kafka monitoring qua Logstash → Kibana-   [x] Kafka monitoring qua Logstash → Kibana

-   [x] Scripts quản lý (kafka-control.sh)-   [x] Scripts quản lý (kafka-control.sh)

-   [x] Test CRUD sản phẩm-   [x] Test CRUD sản phẩm

-   [ ] (Optional) Metricbeat cho performance metrics-   [ ] (Optional) Metricbeat cho performance metrics

-   [ ] (Optional) Bảng `audit_logs` trong database-   [ ] (Optional) Bảng `audit_logs` trong database

-   [ ] (Optional) Alerts cho consumer lag-   [ ] (Optional) Alerts cho consumer lag



------



## 🔗 LIÊN QUAN## 🔗 LIÊN QUAN



-   **Elasticsearch:** Xem [ELASTICSEARCH_COMPLETE.md](./ELASTICSEARCH_COMPLETE.md) để hiểu ES indexing-   **Elasticsearch:** Xem [ELASTICSEARCH_COMPLETE.md](./ELASTICSEARCH_COMPLETE.md) để hiểu ES indexing

-   **Kibana:** Xem [KIBANA_COMPLETE.md](./KIBANA_COMPLETE.md) để visualize Kafka data-   **Kibana:** Xem [KIBANA_COMPLETE.md](./KIBANA_COMPLETE.md) để visualize Kafka data

-   **Docker:** Xem [DOCKER_COMPLETE.md](./DOCKER_COMPLETE.md) để quản lý containers-   **Docker:** Xem [DOCKER_COMPLETE.md](./DOCKER_COMPLETE.md) để quản lý containers



------



**📅 Last Updated:** October 19, 2025  **📅 Last Updated:** October 19, 2025

**✅ Status:** Complete & Production Ready**✅ Status:** Complete & Production Ready
```
