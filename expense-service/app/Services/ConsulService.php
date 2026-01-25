<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ConsulService
{
    protected $host;
    protected $port;

    public function __construct()
    {
        $this->host = config('consul.host', 'consul-server');
        $this->port = config('consul.port', 8500);
    }

    public function registerService(array $serviceConfig)
    {
        try {
            $response = Http::timeout(5)
                ->post("http://{$this->host}:{$this->port}/v1/agent/service/register", $serviceConfig);
            
            if ($response->successful()) {
                Log::info('Service registered with Consul', ['service' => $serviceConfig['Name']]);
                return true;
            }
            
            return false;
        } catch (\Exception $e) {
            Log::error('Failed to register with Consul', ['error' => $e->getMessage()]);
            return false;
        }
    }

    public function deregisterService($serviceId)
    {
        try {
            $response = Http::timeout(5)
                ->put("http://{$this->host}:{$this->port}/v1/agent/service/deregister/{$serviceId}");
            
            if ($response->successful()) {
                Log::info('Service deregistered from Consul', ['service_id' => $serviceId]);
                return true;
            }
            
            return false;
        } catch (\Exception $e) {
            Log::error('Failed to deregister from Consul', ['error' => $e->getMessage()]);
            return false;
        }
    }

    public function getServiceHealth($serviceName)
    {
        try {
            $response = Http::timeout(5)
                ->get("http://{$this->host}:{$this->port}/v1/health/checks/{$serviceName}");
            
            return $response->json();
        } catch (\Exception $e) {
            Log::error('Failed to get service health', ['error' => $e->getMessage()]);
            return null;
        }
    }

    public function discoverService($serviceName)
    {
        try {
            $response = Http::timeout(5)
                ->get("http://{$this->host}:{$this->port}/v1/catalog/service/{$serviceName}");
            
            return $response->json();
        } catch (\Exception $e) {
            Log::error('Failed to discover service', ['error' => $e->getMessage()]);
            return null;
        }
    }
}
