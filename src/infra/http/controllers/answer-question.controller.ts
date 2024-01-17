import { z } from 'zod';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { BadRequestException, Body, Controller, Param, Post, UsePipes } from '@nestjs/common';

const answerQuestionBodySchema = z.object({
	content: z.string(),
});

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
	constructor(private answerQuestion: AnswerQuestionUseCase) {}

    @Post()
    @UsePipes(new ZodValidationPipe(answerQuestionBodySchema))
	async handle(@Body() body: AnswerQuestionBodySchema, @CurrentUser() user: UserPayload, @Param('questionId') questionId: string) {
		const { content } = body;
		const userId = user.sub;

		const result = await this.answerQuestion.execute({
			content,
			questionId,
			authorId: userId,
			attachmentsIds: []
		});
        
		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}