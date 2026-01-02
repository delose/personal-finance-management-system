import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const isDocker = fs.existsSync('/.dockerenv');
  const rabbitHost = isDocker ? 'host.docker.internal' : 'localhost';
  const rabbitMQUrl = `amqp://guest:guest@${rabbitHost}:5672`;

  const httpPort = 3001;

  app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://guest:guest@${rabbitHost}:5672`],
          queue: 'account_queue',
          queueOptions: {
            durable: true
          },
        },
    }
  );
  await app.startAllMicroservices();
  await app.listen(httpPort, '0.0.0.0');

  console.log(`Environment: ${isDocker ? 'Docker' : 'Local'}`);
  console.log(`Connecting to RabbitMQ at: ${rabbitMQUrl}`);
}
bootstrap();
