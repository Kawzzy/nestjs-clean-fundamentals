import { z } from 'zod';
import { AnswerPresenter } from '../presenters/answer-presenter';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers';

const pageValidationParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageValidationParamSchema);

type PageValidationParamSchema = z.infer<typeof pageValidationParamSchema>

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
	constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

    @Get()
	async handle(@Query('page', queryValidationPipe) page: PageValidationParamSchema, @Param('questionId') questionId: string) {

		const result = await this.fetchQuestionAnswers.execute({
			page,
			questionId
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const answers = result.value.answers;

		return { answers: answers.map(AnswerPresenter.toHTTP) };
	}
}