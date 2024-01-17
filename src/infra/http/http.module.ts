import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { JwtEncrypter } from '../cryptography/jwt-encrypter';
import { BcryptHasher } from '../cryptography/bcrypt-hasher';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { EditAnswerController } from './controllers/edit-answer.controller';
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { AuthenticateController } from './controllers/authenticate.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { DeleteAnswerController } from './controllers/delete-answer.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { AnswerQuestionController } from './controllers/answer-question.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { DeleteQuestionController } from './controllers/delete-question.controller';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { PrismaAnswersRepository } from '../database/prisma/repositories/prisma-answers-repository';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { PrismaStudentsRepository } from '../database/prisma/repositories/prisma-students-repository';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { PrismaQuestionsRepository } from '../database/prisma/repositories/prisma-questions-repository';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { PrismaAnswerAttachmentsRepository } from '../database/prisma/repositories/prisma-answer-attachments-repository';
import { PrismaQuestionAttachmentsRepository } from '../database/prisma/repositories/prisma-question-attachments-repository';

@Module({
	imports: [
		DatabaseModule,
		CryptographyModule
	],
	controllers: [
		EditAnswerController,
		AuthenticateController,
		EditQuestionController,
		DeleteAnswerController,
		CreateAccountController,
		CreateQuestionController,
		AnswerQuestionController,
		DeleteQuestionController,
		GetQuestionBySlugController,
		FetchQuestionAnswersController,
		FetchRecentQuestionsController
	],
	providers: [
		{
			provide: CreateQuestionUseCase,
			useFactory: (questionsRepository: QuestionsRepository) => {
				return new CreateQuestionUseCase(questionsRepository);
			},
			inject: [PrismaQuestionsRepository]
		}, {
			provide: FetchRecentQuestionsUseCase,
			useFactory: (questionsRepository: QuestionsRepository) => {
				return new FetchRecentQuestionsUseCase(questionsRepository);
			},
			inject: [PrismaQuestionsRepository]
		}, {
			provide: AuthenticateStudentUseCase,
			useFactory: (studentsRepository: StudentsRepository, hashComparer: HashComparer, encrypter: Encrypter) => {
				return new AuthenticateStudentUseCase(studentsRepository, hashComparer, encrypter);
			},
			inject: [PrismaStudentsRepository, BcryptHasher, JwtEncrypter]
		}, {
			provide: RegisterStudentUseCase,
			useFactory: (studentsRepository: StudentsRepository, hashGenerator: HashGenerator) => {
				return new RegisterStudentUseCase(studentsRepository, hashGenerator);
			},
			inject: [PrismaStudentsRepository, BcryptHasher]
		}, {
			provide: GetQuestionBySlugUseCase,
			useFactory: (questionsRepository: QuestionsRepository) => {
				return new GetQuestionBySlugUseCase(questionsRepository);
			},
			inject: [PrismaQuestionsRepository]
		}, {
			provide: EditQuestionUseCase,
			useFactory: (
				questionsRepository: QuestionsRepository,
				questionAttachmentRepository: QuestionAttachmentsRepository
			) => {
				return new EditQuestionUseCase(questionsRepository, questionAttachmentRepository);
			},
			inject: [PrismaQuestionsRepository, PrismaQuestionAttachmentsRepository]
		}, {
			provide: DeleteQuestionUseCase,
			useFactory: (questionsRepository: QuestionsRepository) => {
				return new DeleteQuestionUseCase(questionsRepository);
			},
			inject: [PrismaQuestionsRepository]
		}, {
			provide: AnswerQuestionUseCase,
			useFactory: (answersRepository: AnswersRepository) => {
				return new AnswerQuestionUseCase(answersRepository);
			},
			inject: [PrismaAnswersRepository]
		}, {
			provide: EditAnswerUseCase,
			useFactory: (
				answersRepository: AnswersRepository,
				answerAttachmentsRepository: AnswerAttachmentsRepository
			) => {
				return new EditAnswerUseCase(answersRepository, answerAttachmentsRepository);
			},
			inject: [PrismaAnswersRepository, PrismaAnswerAttachmentsRepository]
		}, {
			provide: DeleteAnswerUseCase,
			useFactory: (answersRepository: AnswersRepository) => {
				return new DeleteAnswerUseCase(answersRepository);
			},
			inject: [PrismaAnswersRepository]
		}, {
			provide: FetchQuestionAnswersUseCase,
			useFactory: (answersRepository: AnswersRepository) => {
				return new FetchQuestionAnswersUseCase(answersRepository);
			},
			inject: [PrismaAnswersRepository]
		}
	]
})
export class HttpModule {}