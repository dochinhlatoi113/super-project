<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Kafka Brokers
    |--------------------------------------------------------------------------
    */
    'brokers' => env('KAFKA_BROKERS', 'kafka:9092'),

    /*
    |--------------------------------------------------------------------------
    | Global Auto Commit (Fix lỗi null)
    |--------------------------------------------------------------------------
    */
    'auto_commit' => true,

    /*
    |--------------------------------------------------------------------------
    | Default consumer group id
    |--------------------------------------------------------------------------
    */
    'consumer_group_id' => env('KAFKA_CONSUMER_GROUP_ID', 'product-group'),

    /*
    |--------------------------------------------------------------------------
    | Kafka topics
    |--------------------------------------------------------------------------
    */
    'topics' => [
        'product_events' => env('KAFKA_TOPIC_PRODUCT_EVENTS', 'product_events'),
        'product_logs' => env('KAFKA_TOPIC_PRODUCT_LOGS', 'product_logs'),
        'product_events_dlq' => env('KAFKA_TOPIC_PRODUCT_EVENTS_DLQ', 'product_events_dlq'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Security protocol
    |--------------------------------------------------------------------------
    */
    'security_protocol' => env('KAFKA_SECURITY_PROTOCOL', 'PLAINTEXT'),

    /*
    |--------------------------------------------------------------------------
    | Consumer options
    |--------------------------------------------------------------------------
    */
    'consumer' => [
        'auto_offset_reset' => env('KAFKA_CONSUMER_AUTO_OFFSET_RESET', 'earliest'),
        'auto_commit' => true,
        'timeout_ms' => env('KAFKA_CONSUMER_TIMEOUT_MS', 120000),
    ],

];
