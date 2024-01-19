import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter';
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments';

const pageValidationParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageValidationParamSchema);

type PageValidationParamSchema = z.infer<typeof pageValidationParamSchema>

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
	constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

    @Get()
	async handle(@Query('page', queryValidationPipe) page: PageValidationParamSchema, @Param('questionId') questionId: string) {

		const result = await this.fetchQuestionComments.execute({
			page,
			questionId
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const comments = result.value.comments;

		return { answers: comments.map(CommentWithAuthorPresenter.toHTTP) };
	}
}