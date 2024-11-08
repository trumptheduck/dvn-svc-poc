import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Permissions } from './core/decorators/role.decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Permissions("user.test.get")
  @Get()
  test() {
    return {
      result: "success"
    };
  }
}
