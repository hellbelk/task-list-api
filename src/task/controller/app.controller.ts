import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class AppController {

  @Get('hello')
  getHello(): string {
    return 'hello'
  }
}
