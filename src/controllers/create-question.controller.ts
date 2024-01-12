import { AuthGuard } from '@nestjs/passport';
import { UserPayload } from 'src/auth/jwt.strategy';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
	constructor() {}

	@Post()
	async handle(@CurrentUser() user: UserPayload) {

		user.sub;
		return 'new question';
	}
}