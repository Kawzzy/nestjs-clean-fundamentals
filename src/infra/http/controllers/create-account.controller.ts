import { z } from 'zod';
import { hash } from 'bcryptjs';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { Body, ConflictException, Controller, Post, UsePipes } from '@nestjs/common';

const createAccountBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string()
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
	constructor(private prismaConnection: PrismaService) {}

    @Post()
	@UsePipes(new ZodValidationPipe(createAccountBodySchema))
	async handle(@Body() body: CreateAccountBodySchema) {
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