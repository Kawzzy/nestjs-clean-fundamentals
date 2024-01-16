import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { JwtEncrypter } from '../cryptography/jwt-encrypter';
import { BcryptHasher } from '../cryptography/bcrypt-hasher';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { AuthenticateController } from './controllers/authenticate.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { DeleteQuestionController } from './controllers/delete-question.controller';
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { PrismaStudentsRepository } from '../database/prisma/repositories/prisma-students-repository';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { PrismaQuestionsRepository } from '../database/prisma/repositories/prisma-questions-repository';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { PrismaQuestionAttachmentsRepository } from '../database/prisma/repositories/prisma-question-attachments-repository';

@Module({
	imports: [
		DatabaseModule,
		CryptographyModule
	],
	controllers: [
		AuthenticateController,
		EditQuestionController,
		CreateAccountController,
		CreateQuestionController,
		DeleteQuestionController,
		GetQuestionBySlugController,
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
		}
	]
})
export class HttpModule {}