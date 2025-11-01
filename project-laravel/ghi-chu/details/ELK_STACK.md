# 📊 ELK Stack Setup Guide

> Elasticsearch + Logstash + Kibana for Laravel Project

---

## 🎯 What is ELK Stack?

**ELK Stack** = **E**lasticsearch + **L**ogstash + **K**ibana

-   **Elasticsearch** - Search and analytics engine (store data)
-   **Logstash** - Data processing pipeline (collect & transform logs)
-   **Kibana** - Visualization tool (view data in dashboards)

---

## 🐳 Docker Services

### Services Added

```
docker-main/docker-compose.yml:
├── elasticsearch:9200   # Already exists
├── logstash:5000,5044   # ← NEW
└── kibana:5601          # ← NEW
```

### Ports

| Service            | Port | URL                                          |
| ------------------ | ---- | -------------------------------------------- |
| **Elasticsearch**  | 9200 | http://localhost:9200                        |
| **Logstash TCP**   | 5001 | tcp://localhost:5001 (host → 5000 container) |
| **Logstash Beats** | 5044 | tcp://localhost:5044                         |
| **Logstash API**   | 9600 | http://localhost:9600                        |
| **Kibana**         | 5601 | http://localhost:5601                        |

**Note:** Logstash TCP uses port **5001 on host** (maps to 5000 in container) because port 5000 is already in use.

---

## 🚀 Quick Start

### 1. Start ELK Stack

```bash
cd /Users/buimanhkhuong/Desktop/project/docker-main
docker-compose up -d
```

### 2. Wait for Services to Start

```bash
# Check status
docker ps | grep -E "elasticsearch|logstash|kibana"

# Check Elasticsearch (should see cluster info)
curl http://localhost:9200

# Check Logstash API
curl http://localhost:9600

# Open Kibana in browser
open http://localhost:5601
```

### 3. Verify Logstash is Running

```bash
# Check logs
docker logs laravel_logstash

# Should see:
# [INFO] Successfully started Logstash API endpoint
# [INFO] Pipelines running
```

---

## 📝 Send Logs to Logstash

### Method 1: TCP JSON Input (Simple)

```bash
# Test with simple JSON
echo '{"message":"Hello from Laravel","level":"info","app":"laravel"}' | nc localhost 5001

# From Laravel code
$data = [
    'message' => 'User logged in',
    'level' => 'info',
    'user_id' => 123,
    'ip' => request()->ip(),
    'timestamp' => now()->toIso8601String()
];

$fp = fsockopen('localhost', 5001);
fwrite($fp, json_encode($data) . "\n");
fclose($fp);
```

### Method 2: Laravel Monolog Handler (Recommended)

Install package:

```bash
docker exec laravel_php composer require hedii/laravel-log-to-logstash
```

Update `config/logging.php`:

```php
'channels' => [
    'logstash' => [
        'driver' => 'monolog',
        'handler' => Hedii\LaravelLogToLogstash\LogstashHandler::class,
        'formatter' => Hedii\LaravelLogToLogstash\LogstashFormatter::class,
        'host' => env('LOGSTASH_HOST', 'laravel_logstash'),
        'port' => env('LOGSTASH_PORT', 5000),
        'level' => env('LOG_LEVEL', 'debug'),
    ],
],
```

Update `.env`:

```env
LOGSTASH_HOST=laravel_logstash
LOGSTASH_PORT=5000
LOG_CHANNEL=logstash
```

Use in code:

```php
use Illuminate\Support\Facades\Log;

// Simple log
Log::info('User action', ['user_id' => 123]);

// With context
Log::channel('logstash')->error('Payment failed', [
    'user_id' => $user->id,
    'amount' => $amount,
    'error' => $exception->getMessage()
]);
```

### Method 3: Custom Logger

Create `app/Services/LogstashLogger.php`:

```php
<?php

namespace App\Services;

class LogstashLogger
{
    private $host;
    private $port;

    public function __construct()
    {
        $this->host = config('logging.channels.logstash.host', 'laravel_logstash');
        $this->port = config('logging.channels.logstash.port', 5000);
    }

    public function log(string $level, string $message, array $context = []): void
    {
        $data = [
            'message' => $message,
            'level' => $level,
            'timestamp' => now()->toIso8601String(),
            'env' => app()->environment(),
            'app' => config('app.name'),
            'context' => $context,
        ];

        try {
            $socket = fsockopen($this->host, $this->port, $errno, $errstr, 1);
            if ($socket) {
                fwrite($socket, json_encode($data) . "\n");
                fclose($socket);
            }
        } catch (\Exception $e) {
            // Fallback to file log
            \Log::error('Failed to send to Logstash: ' . $e->getMessage());
        }
    }
}
```

Usage:

```php
$logger = app(LogstashLogger::class);
$logger->log('info', 'User logged in', ['user_id' => 123]);
```

---

## 📊 Kibana Setup

### 1. Access Kibana

Open: http://localhost:5601

### 2. Create Index Pattern

1. Go to **Management** → **Stack Management** → **Index Patterns**
2. Click **Create index pattern**
3. Index pattern: `laravel-logs-*`
4. Timestamp field: `@timestamp`
5. Click **Create index pattern**

### 3. View Logs

1. Go to **Analytics** → **Discover**
2. Select index pattern: `laravel-logs-*`
3. Set time range (top right)
4. View logs in real-time!

### 4. Create Visualizations

**Line Chart - Logs Over Time:**

1. Go to **Analytics** → **Visualize Library**
2. Create visualization → Line
3. Data source: `laravel-logs-*`
4. Metrics: Count
5. Buckets: Date Histogram on `@timestamp`

**Pie Chart - Log Levels:**

1. Create visualization → Pie
2. Data source: `laravel-logs-*`
3. Metrics: Count
4. Buckets: Terms aggregation on `level.keyword`

**Data Table - Recent Errors:**

1. Create visualization → Table
2. Filter: `level: error`
3. Columns: `timestamp`, `message`, `context`

### 5. Create Dashboard

1. Go to **Analytics** → **Dashboard**
2. Create new dashboard
3. Add saved visualizations
4. Arrange and save

---

## 🔍 Query Examples in Kibana

### KQL (Kibana Query Language)

```kql
# All error logs
level: error

# Specific user
context.user_id: 123

# Search in message
message: "payment failed"

# Multiple conditions
level: error AND env: production

# Range query
@timestamp >= "2025-10-18" AND @timestamp <= "2025-10-19"

# Exists field
_exists_: context.user_id

# Wildcard
message: *exception*
```

### Lucene Syntax

```lucene
# Error logs from last hour
level:error AND @timestamp:[now-1h TO now]

# Multiple levels
level:(error OR warning)

# Exclude
level:info NOT message:*debug*
```

---

## 📈 Useful Dashboards

### 1. Real-time Monitoring Dashboard

Widgets:

-   Line chart: Requests per minute
-   Pie chart: Log levels distribution
-   Data table: Latest errors
-   Metric: Total requests today
-   Metric: Error rate

### 2. Performance Dashboard

Widgets:

-   Line chart: Response time over time
-   Heat map: Slow requests by endpoint
-   Data table: Slowest queries
-   Metric: Average response time

### 3. User Activity Dashboard

Widgets:

-   Line chart: Active users over time
-   Pie chart: Top user actions
-   Data table: Recent user activities
-   Map: User locations (if using geoip)

---

## 🛠️ Logstash Configuration

### Current Pipeline

Location: `docker-main/logstash/pipeline/logstash.conf`

**Input:**

-   TCP port 5000 (JSON)
-   Beats port 5044

**Filter:**

-   Parse Laravel logs
-   Extract log level
-   Add timestamp
-   Geoip (if IP present)

**Output:**

-   Elasticsearch index: `laravel-logs-YYYY.MM.dd`
-   Stdout (debug)

### Custom Pipeline

Create new file: `docker-main/logstash/pipeline/custom.conf`

```conf
input {
  tcp {
    port => 5001
    codec => json
    tags => ["custom"]
  }
}

filter {
  # Your custom filters
}

output {
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "custom-logs-%{+YYYY.MM.dd}"
  }
}
```

Update `docker-compose.yml` to expose port 5001.

---

## 🔧 Advanced Features

### 1. Alerting

Create alert in Kibana:

1. **Management** → **Stack Management** → **Rules and Connectors**
2. Create rule
3. Condition: Count of errors > 10 in 5 minutes
4. Action: Send email/webhook

### 2. Saved Searches

Save common queries:

1. Execute search in Discover
2. Click **Save** (top right)
3. Name: "Production Errors"
4. Access later from saved searches

### 3. Watcher (Paid feature in X-Pack)

Monitor for specific conditions and trigger actions.

### 4. Machine Learning (Paid)

Anomaly detection for log patterns.

---

## 📊 Index Management

### View Indices

```bash
# List all indices
curl http://localhost:9200/_cat/indices?v

# Specific pattern
curl http://localhost:9200/_cat/indices/laravel-logs-*?v
```

### Delete Old Indices

```bash
# Delete specific index
curl -X DELETE http://localhost:9200/laravel-logs-2025.10.01

# Delete old indices (30 days)
curl -X DELETE http://localhost:9200/laravel-logs-$(date -d '30 days ago' +%Y.%m.%d)
```

### Index Lifecycle Management (ILM)

Create policy to auto-delete old logs:

```json
PUT _ilm/policy/laravel-logs-policy
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_age": "1d"
          }
        }
      },
      "delete": {
        "min_age": "30d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}
```

---

## 🔍 Troubleshooting

### Logstash not receiving logs

```bash
# Check Logstash is running
docker ps | grep logstash

# Check logs
docker logs laravel_logstash -f

# Test TCP connection
telnet localhost 5000
# Then type JSON and press Enter

# Test with netcat
echo '{"test":"message"}' | nc localhost 5000
```

### Kibana connection refused

```bash
# Check Kibana is running
docker logs laravel_kibana

# Check Elasticsearch connection
curl http://localhost:9200/_cluster/health

# Restart Kibana
docker restart laravel_kibana
```

### No data in Kibana

1. Check index pattern matches: `laravel-logs-*`
2. Check time range (top right corner)
3. Verify logs in Elasticsearch:
    ```bash
    curl http://localhost:9200/laravel-logs-*/_search?pretty
    ```
4. Check Logstash is sending to Elasticsearch:
    ```bash
    docker logs laravel_logstash | grep -i elasticsearch
    ```

### High memory usage

Edit `docker-compose.yml`:

```yaml
elasticsearch:
    environment:
        - ES_JAVA_OPTS=-Xms256m -Xmx256m # Reduce from 512m
```

```bash
docker-compose up -d elasticsearch
```

---

## 📚 Resources

-   [Elasticsearch Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
-   [Logstash Documentation](https://www.elastic.co/guide/en/logstash/current/index.html)
-   [Kibana Documentation](https://www.elastic.co/guide/en/kibana/current/index.html)
-   [KQL Syntax](https://www.elastic.co/guide/en/kibana/current/kuery-query.html)

---

## ✅ Checklist

-   [ ] Start ELK Stack: `docker-compose up -d`
-   [ ] Verify services are running
-   [ ] Access Kibana: http://localhost:5601
-   [ ] Create index pattern: `laravel-logs-*`
-   [ ] Send test log to Logstash
-   [ ] View logs in Kibana Discover
-   [ ] Create visualizations
-   [ ] Create dashboard
-   [ ] Setup alerts (optional)
-   [ ] Configure Laravel logging

---

**Last Updated:** October 18, 2025
