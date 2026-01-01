import { Controller, Get, Inject, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ACCOUNT_SERVICE } from './constants';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              @Inject(ACCOUNT_SERVICE) private readonly accountRMQClient: ClientProxy
    ) {}

  @Get('health')
  checkHealth() {
    return { status: 'OK' };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('account')
  createAccount(@Body() account: any) {
    this.accountRMQClient.emit("account-created", account);
    let MESSAGE = "Account creation request sent to RabbitMq: " + JSON.stringify(account);
    console.log(MESSAGE);
    return { message: MESSAGE + ": ", account };
  }

  // Transactions acts as gateway for actual CRUD operations for
  // 1. account
  // n. others
}
