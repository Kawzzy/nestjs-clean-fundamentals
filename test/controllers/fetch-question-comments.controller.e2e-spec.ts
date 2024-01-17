import request from 'supertest';

import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { DatabaseModule } from '@/infra/database/database.module';
import { QuestionCommentFactory } from 'test/factories/make-question-comment';

describe('Fetch question comments (E2E)', () => {
	let app: INestApplication;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let questionCommentFactory: QuestionCommentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				AppModule,
				DatabaseModule
			],
			providers: [
				StudentFactory,
				QuestionFactory,
				QuestionCommentFactory
			]
		}).compile();

		app = moduleRef.createNestApplication();
        
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		questionCommentFactory = moduleRef.get(QuestionCommentFactory);

		await app.init();
	});

	test('[GET] /questions/:questionId/comments', async () => {

		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({ authorId: user.id });

		const questionId = question.id.toString();

		const content1 = 'Comment1';
		const content2 = 'Comment2';
		const content3 = 'Comment3';

		await Promise.all([
			questionCommentFactory.makePrismaQuestionComment({ authorId: user.id, questionId: question.id, content: content1 }),
			questionCommentFactory.makePrismaQuestionComment({ authorId: user.id, questionId: question.id, content: content2 }),
			questionCommentFactory.makePrismaQuestionComment({ authorId: user.id, questionId: question.id, content: content3 })
		]);

		const response = await request(app.getHttpServer())
			.get(`/questions/${questionId}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			answers: expect.arrayContaining([
				expect.objectContaining({ content: content1 }),
				expect.objectContaining({ content: content2 }),
				expect.objectContaining({ content: content3 })
			])
		});
	});
});