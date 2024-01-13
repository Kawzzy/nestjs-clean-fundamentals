import request from 'supertest';

import { hash } from 'bcryptjs';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Authenticate (E2E)', () => {
	let app: INestApplication;
	let prismaConnection: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();

		app = moduleRef.createNestApplication();

		prismaConnection = moduleRef.get(PrismaService);

		await app.init();
	});

	test('[POST] /sessions', async () => {
		const email = 'tester@test.com';
		const password = 'test123';

		await prismaConnection.user.create({
			data: {
				name: 'Tester',
				email,
				password: await hash(password, 6)
			}
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