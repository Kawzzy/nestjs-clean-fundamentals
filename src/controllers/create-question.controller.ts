import { AuthGuard } from '@nestjs/passport';
import { Controller, Post, UseGuards } from '@nestjs/common';

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
	constructor() {}

	@Post()
	async handle() {
		return 'new question';
	}
}