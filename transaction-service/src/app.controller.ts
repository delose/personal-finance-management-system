import { Controller, Get, Inject, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ACCOUNT_SERVICE } from './constants';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              @Inject(ACCOUNT_SERVICE) private readonly accountRMQClient: ClientProxy
    ) {
      this.accountRMQClient.status.subscribe(status => {
        console.log('RMQ Client Status:', status); // Should log 'connected'
      });
    }

  @Get('health')
  checkHealth() {
    return { status: 'OK' };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

    @Post('account')
    async createAccount(@Body() account: any) {
      try {
        // This forces NestJS to wait for the message to be dispatched
        await lastValueFrom(this.accountRMQClient.emit("account-created", account));
        console.log("Account emitted successfully:", account);
      } catch (err) {
        console.error("Failed to emit to RMQ:", err);
      }
    }

  // Transactions acts as gateway for actual CRUD operations for
  // 1. account
  // n. others
}
