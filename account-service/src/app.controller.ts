import { Controller, Get, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {

  @MessagePattern("account-created")
  handleAccountCreated(@Payload() account: any) {
    console.log('[Account-Service: Received account: ', account);
  }
}
