import request from 'supertest';

import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Fetch recent questions (E2E)', () => {
	let app: INestApplication;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				AppModule,
				DatabaseModule
			],
			providers: [
				StudentFactory,
				QuestionFactory
			]
		}).compile();

		app = moduleRef.createNestApplication();
        
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);

		await app.init();
	});

	test('[GET] /questions', async () => {

		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const title1 = 'Question1';
		const title2 = 'Question2';
		const title3 = 'Question3';

		await Promise.all([
			questionFactory.makePrismaQuestion({ authorId: user.id, title: title1 }),
			questionFactory.makePrismaQuestion({ authorId: user.id, title: title2 }),
			questionFactory.makePrismaQuestion({ authorId: user.id, title: title3 })
		]);

		const response = await request(app.getHttpServer())
			.get('/questions')
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			questions: expect.arrayContaining([
				expect.objectContaining({ title: title1 }),
				expect.objectContaining({ title: title2 }),
				expect.objectContaining({ title: title3 })
			])
		});
	});
});