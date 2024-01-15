import { z } from 'zod';
import { AuthGuard } from '@nestjs/passport';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { BadRequestException, Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
	constructor(private createQuestion: CreateQuestionUseCase) {}
	
	@Post()
	@UsePipes(new ZodValidationPipe(createQuestionBodySchema))
	async handle(@Body() body: CreateQuestionBodySchema, @CurrentUser() user: UserPayload) {
		const { title, content } = body;
		const userId = user.sub;

		const result = await this.createQuestion.execute({
			title,
			content,
			authorId: userId,
			attachmentsIds: []
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
