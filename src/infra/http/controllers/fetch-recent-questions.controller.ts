import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { HttpQuestionPresenter } from '../presenters/http-question-presenter';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';

const pageValidationParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageValidationParamSchema);

type PageValidationParamSchema = z.infer<typeof pageValidationParamSchema>

@Controller('/questions')
export class FetchRecentQuestionsController {
	constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

    @Get()
	async handle(@Query('page', queryValidationPipe) page: PageValidationParamSchema) {

		const result = await this.fetchRecentQuestions.execute({
			page
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const questions = result.value.questions;

		return { questions: questions.map(HttpQuestionPresenter.toHTTP) };
	}
}