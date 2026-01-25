<?php

return [
    'host' => env('CONSUL_HOST', 'consul-server'),
    'port' => env('CONSUL_PORT', 8500),
    'service_name' => env('CONSUL_SERVICE_NAME', 'expense-service'),
    'service_id' => env('CONSUL_SERVICE_ID', 'expense-service'),
    'check_interval' => env('CONSUL_CHECK_INTERVAL', '10s'),
    'check_timeout' => env('CONSUL_CHECK_TIMEOUT', '5s'),
    'deregister_critical_service_after' => env('CONSUL_DEREGISTER_CRITICAL_SERVICE_AFTER', '30s'),
];
