import request from 'supertest';

import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

describe('Create question (E2E)', () => {
	let app: INestApplication;
	let prismaConnection: PrismaService;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();

		app = moduleRef.createNestApplication();
        
		prismaConnection = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test('[POST] /questions', async () => {

		const user = await prismaConnection.user.create({
			data: {
				name: 'Tester',
				email: 'tester@test.com',
				password: 'test123'
			}
		});

		const accessToken = jwt.sign({ sub: user.id });

		const response = await request(app.getHttpServer())
			.post('/questions')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'New Question',
				content: 'Question Content'
			});

		expect(response.statusCode).toBe(201);

		const questionOnDatabase = await prismaConnection.question.findFirst({
			where: {
				title: 'New Question'
			}
		});

		expect(questionOnDatabase).toBeTruthy();
	});
});