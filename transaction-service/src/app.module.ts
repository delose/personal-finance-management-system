import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ACCOUNT_SERVICE } from './constants';
import { ConsulService } from './service/consul.service';

@Module({
  imports: [
        ClientsModule.register([
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
          },
        ]),
  ],
  controllers: [AppController],
  providers: [AppService, ConsulService],
})
export class AppModule {}
