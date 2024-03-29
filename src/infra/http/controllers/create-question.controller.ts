import { z } from 'zod';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { BadRequestException, Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
	attachmentsIds: z.array(z.string().uuid())
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
export class CreateQuestionController {
	constructor(private createQuestion: CreateQuestionUseCase) {}
	
	@Post()
	@UsePipes(new ZodValidationPipe(createQuestionBodySchema))
	async handle(@Body() body: CreateQuestionBodySchema, @CurrentUser() user: UserPayload) {
		const { title, content, attachmentsIds } = body;
		const userId = user.sub;

		const result = await this.createQuestion.execute({
			title,
			content,
			authorId: userId,
			attachmentsIds
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
