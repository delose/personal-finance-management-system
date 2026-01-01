import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ACCOUNT_SERVICE } from './constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
        name: ACCOUNT_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'account_queue',
          queueOptions: {
            durable: true
          },
        },
    }
  );
  await app.listen();
  console.log(`Application is listening to RabbitMQ...`);
}
bootstrap();
