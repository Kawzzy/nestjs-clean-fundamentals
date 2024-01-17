import request from 'supertest';

import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { AnswerFactory } from 'test/factories/make-answer';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AnswerCommentFactory } from 'test/factories/make-answer-comment';

describe('Delete answer comment (E2E)', () => {
	let app: INestApplication;
	let jwt: JwtService;
	let prismaConnection: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;
	let answerCommentFactory: AnswerCommentFactory;
    
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				AppModule,
				DatabaseModule
			],
			providers: [
				AnswerFactory,
				StudentFactory,
				QuestionFactory,
				AnswerCommentFactory
			]
		}).compile();
        
		app = moduleRef.createNestApplication();
        
		prismaConnection = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		answerCommentFactory = moduleRef.get(AnswerCommentFactory);

		await app.init();
	});

	test('[DELETE] /answers/comments/:id', async () => {

		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id
		});

		const answerComment = await answerCommentFactory.makePrismaAnswerComment({
			authorId: user.id,
			answerId: answer.id
		});

		const answerCommentId = answerComment.id.toString();

		const response = await request(app.getHttpServer())
			.delete(`/answers/comments/${answerCommentId}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(204);
			
		const commentOnDatabase = await prismaConnection.answer.findUnique({
			where: {
				id: answerCommentId
			}
		});

		expect(commentOnDatabase).toBeNull();
	});
});