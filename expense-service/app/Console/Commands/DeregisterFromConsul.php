<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ConsulService;

class DeregisterFromConsul extends Command
{
    protected $signature = 'consul:deregister';
    protected $description = 'Deregister the service from Consul';

    public function handle()
    {
        $consul = app(ConsulService::class);
        $serviceId = config('consul.service_id', 'expense-service');
        
        if ($consul->deregisterService($serviceId)) {
            $this->info('Successfully deregistered from Consul');
        } else {
            $this->error('Failed to deregister from Consul');
        }
    }
}
