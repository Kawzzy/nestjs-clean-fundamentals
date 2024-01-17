import { z } from 'zod';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { BadRequestException, Body, Controller, Param, Post, UsePipes } from '@nestjs/common';
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';

const commentOnAnswerBodySchema = z.object({
	content: z.string(),
});

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
	constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

    @Post()
    @UsePipes(new ZodValidationPipe(commentOnAnswerBodySchema))
	async handle(@Body() body: CommentOnAnswerBodySchema, @CurrentUser() user: UserPayload, @Param('answerId') answerId: string) {
		const { content } = body;
		const userId = user.sub;

		const result = await this.commentOnAnswer.execute({
			content,
			answerId,
			authorId: userId
		});
        
		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}