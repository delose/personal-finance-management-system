import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Consul from 'consul';
import * as os from 'os';
import * as fs from 'fs';

@Injectable()
export class ConsulService implements OnModuleDestroy {
  private consul: Consul;
  private readonly logger = new Logger(ConsulService.name);
  private serviceId: string;

  constructor() {

    const txnSvcPort = 3002;
    const consultPort = 8500;

    // If running in Docker, 'consul' should be the service name in docker-compose.yml
    const consulHost = process.env.CONSUL_HOST || 'localhost';
    this.consul = new Consul({
      host: consulHost,
      port: consultPort
    });
    this.serviceId = `transaction-service-${txnSvcPort}`;
  }

  // Utility to find the first non-internal IPv4 address
  private getIPAddress(): string {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
      const iface = interfaces[devName];
      if (iface) {
          for (const alias of iface) {
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {

              const isDocker = fs.existsSync('/.dockerenv');

              if (isDocker) {
                  console.log("Detected running on Docker environment")
                  return 'host.docker.internal';
              }
              console.log(`Detected running on Non-docker environment: ${alias.address}`);
              return alias.address;
            }
          }
      }
    }
    return '127.0.0.1'; // Fallback
  }

  async registerService(name: string, port: number) {
    const hostAddr = this.getIPAddress();

    console.log(`name: ${name}, port: ${port}`);

    const details = {
      name: name,
      id: this.serviceId,
      address: hostAddr, // Registers the actual IP (e.g., 172.18.0.x in Docker)
      port: port,
      check: {
        name: `${name} Health Check`,
        // Consul Agent uses this URL to reach your app
        http: `http://${hostAddr}:${port}/health`,
        interval: '10s',
        timeout: '5s',
        deregister_critical_service_after: '30s'
      },
    };

    try {
      await this.consul.agent.service.register(details);
      this.logger.log(`Registered with Consul: ${this.serviceId} at ${hostAddr}`);
    } catch (err) {
      this.logger.error(`Registration failed: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    try {
      await this.consul.agent.service.deregister(this.serviceId);
      this.logger.log(`Deregistered from Consul: ${this.serviceId}`);
    } catch (err) {
      this.logger.error(`Deregistration failed: ${err.message}`);
    }
  }
}
