import request from 'supertest';

import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Create account (E2E)', () => {
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

	test('[POST] /accounts', async () => {
		const email = 'tester@test.com';

		const response = await request(app.getHttpServer()).post('/accounts').send({
			name: 'Tester',
			email,
			password: 'test123'
		});

		expect(response.statusCode).toBe(201);

		const userOnDatabase = await prismaConnection.user.findUnique({
			where: {
				email
			}
		});

		expect(userOnDatabase).toBeTruthy();
	});
});