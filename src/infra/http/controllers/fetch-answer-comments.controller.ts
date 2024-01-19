import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';

const pageValidationParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageValidationParamSchema);

type PageValidationParamSchema = z.infer<typeof pageValidationParamSchema>

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
	constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

    @Get()
	async handle(@Query('page', queryValidationPipe) page: PageValidationParamSchema, @Param('answerId') answerId: string) {

		const result = await this.fetchAnswerComments.execute({
			page,
			answerId
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const answerComments = result.value.comments;

		return { answers: answerComments.map(CommentWithAuthorPresenter.toHTTP) };
	}
}