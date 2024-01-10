import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('/accounts')
export class CreateAccountController {
	constructor(private prismaConnection: PrismaService) {}

    @Post()
	async handle(@Body() body: any) {
		const { name, email, password } = body;

		const existingUser = await this.prismaConnection.user.findUnique({
			where: {
				email
			}
		});

		if (existingUser) {
			throw new ConflictException('User already exists!');
		}

		const hashedPassword = await hash(password, 8);

		await this.prismaConnection.user.create({
			data: {
				name,
				email,
				password: hashedPassword
			}
		});
	}
}