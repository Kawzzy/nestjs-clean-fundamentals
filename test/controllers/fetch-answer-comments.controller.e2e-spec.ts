import request from 'supertest';

import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { AnswerFactory } from 'test/factories/make-answer';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { DatabaseModule } from '@/infra/database/database.module';
import { AnswerCommentFactory } from 'test/factories/make-answer-comment';

describe('Fetch answer comments (E2E)', () => {
	let app: INestApplication;
	let jwt: JwtService;
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
        
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		answerCommentFactory = moduleRef.get(AnswerCommentFactory);

		await app.init();
	});

	test('[GET] /answers/:answerId/comments', async () => {

		const studentName = 'John Doe';

		const user = await studentFactory.makePrismaStudent({ name: studentName });

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({ authorId: user.id });

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id
		});

		const answerId = answer.id.toString();

		const content1 = 'Comment1';
		const content2 = 'Comment2';
		const content3 = 'Comment3';

		await Promise.all([
			answerCommentFactory.makePrismaAnswerComment({ authorId: user.id, answerId: answer.id, content: content1 }),
			answerCommentFactory.makePrismaAnswerComment({ authorId: user.id, answerId: answer.id, content: content2 }),
			answerCommentFactory.makePrismaAnswerComment({ authorId: user.id, answerId: answer.id, content: content3 })
		]);

		const response = await request(app.getHttpServer())
			.get(`/answers/${answerId}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			answers: expect.arrayContaining([
				expect.objectContaining({ content: content1, authorName: studentName }),
				expect.objectContaining({ content: content2, authorName: studentName }),
				expect.objectContaining({ content: content3, authorName: studentName })
			])
		});
	});
});