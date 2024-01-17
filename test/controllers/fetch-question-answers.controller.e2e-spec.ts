import request from 'supertest';

import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { AnswerFactory } from 'test/factories/make-answer';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Fetch question answers (E2E)', () => {
	let app: INestApplication;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				AppModule,
				DatabaseModule
			],
			providers: [
				AnswerFactory,
				StudentFactory,
				QuestionFactory
			]
		}).compile();

		app = moduleRef.createNestApplication();
        
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);

		await app.init();
	});

	test('[GET] /questions/:questionId/answers', async () => {

		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({ authorId: user.id });

		const questionId = question.id.toString();

		const content1 = 'Answer1';
		const content2 = 'Answer2';
		const content3 = 'Answer3';

		await Promise.all([
			answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id, content: content1 }),
			answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id, content: content2 }),
			answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id, content: content3 })
		]);

		const response = await request(app.getHttpServer())
			.get(`/questions/${questionId}/answers`)
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