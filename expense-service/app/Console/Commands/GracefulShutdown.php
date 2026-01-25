<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ConsulService;
use Illuminate\Support\Facades\DB;

class GracefulShutdown extends Command
{
    protected $signature = 'app:shutdown';
    protected $description = 'Gracefully shutdown the application';

    public function handle()
    {
        $this->info('Starting graceful shutdown...');
        
        // Deregister from Consul
        $consul = app(ConsulService::class);
        $serviceId = config('consul.service_id', 'expense-service');
        
        if ($consul->deregisterService($serviceId)) {
            $this->info('✓ Deregistered from Consul');
        } else {
            $this->warn('⚠ Failed to deregister from Consul');
        }
        
        // Close database connections
        DB::disconnect();
        $this->info('✓ Database connections closed');
        
        $this->info('Graceful shutdown complete');
    }
}
