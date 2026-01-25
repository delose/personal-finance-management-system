<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\ConsulService;

class ConsulServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(ConsulService::class, function ($app) {
            return new ConsulService();
        });
    }

    public function boot()
    {
        // Register with Consul on startup (only in production)
        if (config('app.env') === 'production' && !app()->runningInConsole()) {
            $this->registerWithConsul();
        }
    }

    protected function registerWithConsul()
    {
        $consul = app(ConsulService::class);
        
        $serviceConfig = [
            'ID' => config('consul.service_id'),
            'Name' => config('consul.service_name'),
            'Tags' => ['php', 'laravel', 'api'],
            'Address' => config('app.url'),
            'Port' => 80,
            'Check' => [
                'HTTP' => config('app.url') . '/health',
                'Interval' => config('consul.check_interval', '10s'),
                'Timeout' => config('consul.check_timeout', '5s'),
                'DeregisterCriticalServiceAfter' => config('consul.deregister_critical_service_after', '30s')
            ]
        ];

        $consul->registerService($serviceConfig);
    }
}
