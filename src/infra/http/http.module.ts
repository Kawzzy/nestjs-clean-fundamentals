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
import { CommentOnAnswerController } from './controllers/comment-on-answer.controller';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';
import { CommentOnQuestionController } from './controllers/comment-on-question.controller';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment.controller';
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments.controller';
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { DeleteQuestionCommentController } from './controllers/delete-question-comment.controller';
import { FetchQuestionCommentsController } from './controllers/fetch-question-comments.controller';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';
import { PrismaAnswersRepository } from '../database/prisma/repositories/prisma-answers-repository';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { PrismaStudentsRepository } from '../database/prisma/repositories/prisma-students-repository';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import { PrismaQuestionsRepository } from '../database/prisma/repositories/prisma-questions-repository';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller';
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment';
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer';
import { PrismaAnswerCommentsRepository } from '../database/prisma/repositories/prisma-answer-comments-repository';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { PrismaQuestionCommentRepository } from '../database/prisma/repositories/prisma-question-comments-repository';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { PrismaAnswerAttachmentsRepository } from '../database/prisma/repositories/prisma-answer-attachments-repository';
import { PrismaQuestionAttachmentsRepository } from '../database/prisma/repositories/prisma-question-attachments-repository';
import { UploadAttachmentController } from './controllers/upload-attachment.controller';

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
		CommentOnAnswerController,
		UploadAttachmentController,
		CommentOnQuestionController,
		GetQuestionBySlugController,
		DeleteAnswerCommentController,
		FetchAnswerCommentsController,
		FetchQuestionAnswersController,
		FetchRecentQuestionsController,
		DeleteQuestionCommentController,
		FetchQuestionCommentsController,
		ChooseQuestionBestAnswerController
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
		}, {
			provide: ChooseQuestionBestAnswerUseCase,
			useFactory: (
				questionsRepository: QuestionsRepository,
				answersRepository: AnswersRepository
			) => {
				return new ChooseQuestionBestAnswerUseCase(questionsRepository, answersRepository);
			},
			inject: [PrismaQuestionsRepository, PrismaAnswersRepository]
		}, {
			provide: CommentOnQuestionUseCase,
			useFactory: (
				questionsRepository: QuestionsRepository,
				questionCommentsRepository: QuestionCommentsRepository
			) => {
				return new CommentOnQuestionUseCase(questionsRepository, questionCommentsRepository);
			},
			inject: [PrismaQuestionsRepository, PrismaQuestionCommentRepository]
		}, {
			provide: DeleteQuestionCommentUseCase,
			useFactory: (questionCommentsRepository: QuestionCommentsRepository) => {
				return new DeleteQuestionCommentUseCase(questionCommentsRepository);
			},
			inject: [PrismaQuestionCommentRepository]
		}, {
			provide: CommentOnAnswerUseCase,
			useFactory: (
				answersRepository: AnswersRepository,
				answerCommentsRepository: AnswerCommentsRepository
			) => {
				return new CommentOnAnswerUseCase(answersRepository, answerCommentsRepository);
			},
			inject: [PrismaAnswersRepository, PrismaAnswerCommentsRepository]
		}, {
			provide: DeleteAnswerCommentUseCase,
			useFactory: (answerCommentsRepository: AnswerCommentsRepository) => {
				return new DeleteAnswerCommentUseCase(answerCommentsRepository);
			},
			inject: [PrismaAnswerCommentsRepository]
		}, {
			provide: FetchQuestionCommentsUseCase,
			useFactory: (questionCommentsRepository: QuestionCommentsRepository) => {
				return new FetchQuestionCommentsUseCase(questionCommentsRepository);
			},
			inject: [PrismaQuestionCommentRepository]
		}, {
			provide: FetchAnswerCommentsUseCase,
			useFactory: (answerCommentsRepository: AnswerCommentsRepository) => {
				return new FetchAnswerCommentsUseCase(answerCommentsRepository);
			},
			inject: [PrismaAnswerCommentsRepository]
		}
	]
})
export class HttpModule {}