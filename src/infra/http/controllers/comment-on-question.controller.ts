import { z } from 'zod';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { BadRequestException, Body, Controller, Param, Post, UsePipes } from '@nestjs/common';
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';

const commentOnQuestionBodySchema = z.object({
	content: z.string(),
});

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>;

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
	constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

    @Post()
    @UsePipes(new ZodValidationPipe(commentOnQuestionBodySchema))
	async handle(@Body() body: CommentOnQuestionBodySchema, @CurrentUser() user: UserPayload, @Param('questionId') questionId: string) {
		const { content } = body;
		const userId = user.sub;

		const result = await this.commentOnQuestion.execute({
			content,
			questionId,
			authorId: userId
		});
        
		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}