import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { PrismaQuestionsRepository } from '../database/prisma/repositories/prisma-questions-repository';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';

@Module({
	imports: [DatabaseModule],
	controllers: [
		AuthenticateController,
		CreateAccountController,
		CreateQuestionController,
		FetchRecentQuestionsController
	],
	providers: [
		{
			provide: CreateQuestionUseCase,
			useFactory: (questionsRepository: QuestionsRepository) => {
				return new CreateQuestionUseCase(questionsRepository);
			},
			inject: [PrismaQuestionsRepository]
		},
		{
			provide: FetchRecentQuestionsUseCase,
			useFactory: (questionsRepository: QuestionsRepository) => {
				return new FetchRecentQuestionsUseCase(questionsRepository);
			},
			inject: [PrismaQuestionsRepository]
		}
	]
})
export class HttpModule {}