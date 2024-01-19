import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository';
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository';
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository';
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository';
import { PrismaQuestionCommentRepository } from './prisma/repositories/prisma-question-comments-repository';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository';

@Module({
	providers: [
		PrismaService,
		PrismaAnswersRepository,
		PrismaStudentsRepository,
		PrismaQuestionsRepository,
		PrismaAttachmentsRepository,
		PrismaAnswerCommentsRepository,
		PrismaQuestionCommentRepository,
		PrismaAnswerAttachmentsRepository,
		PrismaQuestionAttachmentsRepository
	],
	exports: [
		PrismaService,
		PrismaAnswersRepository,
		PrismaStudentsRepository,
		PrismaQuestionsRepository,
		PrismaAttachmentsRepository,
		PrismaAnswerCommentsRepository,
		PrismaQuestionCommentRepository,
		PrismaAnswerAttachmentsRepository,
		PrismaQuestionAttachmentsRepository
	]
})
export class DatabaseModule {}