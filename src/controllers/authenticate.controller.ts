import { JwtService } from '@nestjs/jwt';
import { Controller, Post } from '@nestjs/common';

@Controller('/sessions')
export class AuthenticateController {
	constructor(private jwt: JwtService) {}

    @Post()
	async handle() {
		const token = this.jwt.sign({ sub: 'user-id'});

		return token;
	}
}