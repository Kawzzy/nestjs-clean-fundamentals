import request from 'supertest';

import { hash } from 'bcryptjs';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { StudentFactory } from 'test/factories/make-student';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Authenticate (E2E)', () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				AppModule,
				DatabaseModule
			],
			providers: [StudentFactory]
		}).compile();

		app = moduleRef.createNestApplication();

		studentFactory = moduleRef.get(StudentFactory);

		await app.init();
	});

	test('[POST] /sessions', async () => {
		const email = 'tester@test.com';
		const password = 'test123';

		await studentFactory.makePrismaStudent({
			email,
			password: await hash(password, 8)
		});

		const response = await request(app.getHttpServer()).post('/sessions').send({
			email,
			password
		});

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			accessToken: expect.any(String)
		});
	});
});