import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService, private readonly prismaConnection: PrismaService) {}

  @Get()
	getHello(): string {
		return this.appService.getHello();
	}
}
