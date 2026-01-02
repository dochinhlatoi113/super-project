<?php

use Monolog\Handler\NullHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\SyslogUdpHandler;
use Monolog\Processor\PsrLogMessageProcessor;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Log Channel
    |--------------------------------------------------------------------------
    |
    | This option defines the default log channel that is utilized to write
    | messages to your logs. The value provided here should match one of
    | the channels present in the list of "channels" configured below.
    |
    */

    'default' => env('LOG_CHANNEL', 'single'),

    /*
    |--------------------------------------------------------------------------
    | Deprecations Log Channel
    |--------------------------------------------------------------------------
    |
    | This option controls the log channel that should be used to log warnings
    | regarding deprecated PHP and library features. This allows you to get
    | your application ready for upcoming major versions of dependencies.
    |
    */

    'deprecations' => [
        'channel' => env('LOG_DEPRECATIONS_CHANNEL', 'null'),
        'trace' => env('LOG_DEPRECATIONS_TRACE', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Log Channels
    |--------------------------------------------------------------------------
    |
    | Here you may configure the log channels for your application. Laravel
    | utilizes the Monolog PHP logging library, which includes a variety
    | of powerful log handlers and formatters that you're free to use.
    |
    | Available drivers: "single", "daily", "slack", "syslog",
    |                    "errorlog", "monolog", "custom", "stack"
    |
    */

    'channels' => [
        //start custom log elasticsearch
        'elasticsearch' => [
            'driver' => 'single',
            'path' => base_path('app/Domain/Storage/logs/elasticsearch.log'),
            'level' => 'debug',
        ],
        //end custom log elasticsearch

        //start custom log kafka
        'kafka' => [
            'driver' => 'single',
            'path' => base_path('app/Domain/Storage/logs/kafka.log'),
            'level' => 'debug',
        ],
        //end custom log kafka

        //start custom log redis_file (writes redis logs locally)
        'redis_file' => [
            'driver' => 'single',
            'path' => base_path('app/Domain/Storage/logs/redis.log'),
            'level' => env('LOG_LEVEL', 'debug'),
            'replace_placeholders' => true,
        ],
        //end custom log redis_file

        //start custom log redis
        'redis' => [
            'driver' => 'stack',
            'channels' => ['redis_file', 'redis_logstash'],
            'ignore_exceptions' => false,
        ],
        //end custom log redis

        //start custom log redis_logstash - only error level forwarded to logstash
        'redis_logstash' => [
            'driver' => 'monolog',
            'level' => 'error',
            'handler' => Monolog\Handler\SocketHandler::class,
            'handler_with' => [
                'connectionString' => env('LOGSTASH_HOST', 'tcp://logstash:5000'),
                'timeout' => 1,
                'persistent' => false,
            ],
            'formatter' => Monolog\Formatter\JsonFormatter::class,
            'formatter_with' => [
                'appendNewline' => true,
            ],
            'processors' => [
                function ($record) {
                    $record['message'] = sprintf(
                        '[%s] %s.%s: %s',
                        date('Y-m-d H:i:s'),
                        config('app.env'),
                        strtoupper($record['level_name']),
                        $record['message']
                    );

                    if (isset($record['context']['exception']) && $record['context']['exception'] instanceof \Throwable) {
                        $e = $record['context']['exception'];
                        $record['context']['error'] = $e->getMessage();
                        $record['context']['file'] = $e->getFile();
                        $record['context']['line'] = $e->getLine();
                        unset($record['context']['exception']);
                    }

                    $record['extra']['app'] = config('app.name');
                    $record['extra']['env'] = config('app.env');
                    $record['extra']['host'] = gethostname();

                    return $record;
                },
            ],


        ],
        //end custom log redis_logstash

        //start custom log product
        'product' => [
            'driver' => 'single',
            'path' => base_path('app/Domain/Product/storage/logs/product.log'),
            'level' => 'debug',
        ],
        //end custom log product

        //start custom log category
        'category' => [
            'driver' => 'single',
            'path' => base_path('app/Domain/Category/storage/logs/category.log'),
            'level' => 'debug',
        ],
        //end custom log category

        //start custom log brand
        'brand' => [
            'driver' => 'single',
            'path' => base_path('app/Domain/Brand/storage/logs/brand.log'),
            'level' => 'debug',
        ],
        //end custom log brand

        //start custom log logstash - Send logs to Kibana
        'logstash' => [
            'driver' => 'monolog',
            'level' => env('LOG_LEVEL', 'debug'),
            'handler' => Monolog\Handler\SocketHandler::class,
            'handler_with' => [
                'connectionString' => env('LOGSTASH_HOST', 'tcp://logstash:8080'),
                'timeout' => 1,
                'persistent' => false,
            ],
            'formatter' => Monolog\Formatter\JsonFormatter::class,
            'formatter_with' => [
                'appendNewline' => true,
            ],
            'processors' => [
                function ($record) {
                    $record['extra']['app'] = config('app.name');
                    $record['extra']['env'] = config('app.env');
                    $record['extra']['host'] = gethostname();
                    return $record;
                },
            ],
        ],
        //end custom log logstash

        'stack' => [
            'driver' => 'stack',
            'channels' => explode(',', (string) env('LOG_STACK', 'single,logstash')),
            'ignore_exceptions' => false,
        ],

        'single' => [
            'driver' => 'single',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('LOG_LEVEL', 'debug'),
            'replace_placeholders' => true,
        ],

        'daily' => [
            'driver' => 'daily',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('LOG_LEVEL', 'debug'),
            'days' => env('LOG_DAILY_DAYS', 3),
            'replace_placeholders' => true,
        ],

        'slack' => [
            'driver' => 'slack',
            'url' => env('LOG_SLACK_WEBHOOK_URL'),
            'username' => env('LOG_SLACK_USERNAME', 'Laravel Log'),
            'emoji' => env('LOG_SLACK_EMOJI', ':boom:'),
            'level' => env('LOG_LEVEL', 'critical'),
            'replace_placeholders' => true,
        ],

        'papertrail' => [
            'driver' => 'monolog',
            'level' => env('LOG_LEVEL', 'debug'),
            'handler' => env('LOG_PAPERTRAIL_HANDLER', SyslogUdpHandler::class),
            'handler_with' => [
                'host' => env('PAPERTRAIL_URL'),
                'port' => env('PAPERTRAIL_PORT'),
                'connectionString' => 'tls://' . env('PAPERTRAIL_URL') . ':' . env('PAPERTRAIL_PORT'),
            ],
            'processors' => [PsrLogMessageProcessor::class],
        ],

        'stderr' => [
            'driver' => 'monolog',
            'level' => env('LOG_LEVEL', 'debug'),
            'handler' => StreamHandler::class,
            'handler_with' => [
                'stream' => 'php://stderr',
            ],
            'formatter' => env('LOG_STDERR_FORMATTER'),
            'processors' => [PsrLogMessageProcessor::class],
        ],

        'syslog' => [
            'driver' => 'syslog',
            'level' => env('LOG_LEVEL', 'debug'),
            'facility' => env('LOG_SYSLOG_FACILITY', LOG_USER),
            'replace_placeholders' => true,
        ],

        'errorlog' => [
            'driver' => 'errorlog',
            'level' => env('LOG_LEVEL', 'debug'),
            'replace_placeholders' => true,
        ],

        'null' => [
            'driver' => 'monolog',
            'handler' => NullHandler::class,
        ],

        'emergency' => [
            'path' => storage_path('logs/laravel.log'),
        ],

    ],

];
