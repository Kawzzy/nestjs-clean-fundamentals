import { z } from 'zod';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { Body, Controller, Post, UnauthorizedException, UsePipes } from '@nestjs/common';

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string()
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
	constructor(private jwt: JwtService, private prismaConnection: PrismaService) {}

    @Post()
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() body: AuthenticateBodySchema) {
		const { email, password } = body;

		const user = await this.prismaConnection.user.findUnique({
			where: {
				email
			}
		});

		if (!user) {
			throw new UnauthorizedException('User\'s credentials don\'t match.');
		}
		
		const isPasswordValid = compare(password, user.password);
		
		if (!isPasswordValid) {
			throw new UnauthorizedException('User\'s credentials don\'t match.');
		}

		const accessToken = this.jwt.sign({ sub: user.id});

		return {
			accessToken
		};
	}
}