import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConsulService } from './service/consul.service';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const httpPort = 3003; // Port for Consul Health Check (HTTP)
  const tcpPort = 3002; // Port for Microservice Messaging (TCP)

  // 1. Connect TCP Microservice on 3003
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: tcpPort,
    },
  });

  // 2. Register HTTP Port with Consul (Consul checks this for /health)
  const consulService = app.get(ConsulService);
  await consulService.registerService('transaction-service', httpPort);

  // 3. Start both
  await app.startAllMicroservices();
  await app.listen(httpPort, '0.0.0.0'); // Listen for Health Checks on 3003
}

bootstrap();
