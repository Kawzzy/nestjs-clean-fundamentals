import request from 'supertest';

import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Fetch recent questions (E2E)', () => {
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

	test('[GET] /questions', async () => {

		const user = await prismaConnection.user.create({
			data: {
				name: 'Tester',
				email: 'tester@test.com',
				password: 'test123'
			}
		});

		const accessToken = jwt.sign({ sub: user.id });

		await prismaConnection.question.createMany({
			data: [
				{
					authorId: user.id,
					title: 'Question1',
					slug: 'question1',
					content: 'question content 1'
				},
				{
					authorId: user.id,
					title: 'Question2',
					slug: 'question2',
					content: 'question content 2'
				},
				{
					authorId: user.id,
					title: 'Question3',
					slug: 'question3',
					content: 'question content 3'
				},
			]
		});

		const response = await request(app.getHttpServer())
			.get('/questions')
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			questions: [
				expect.objectContaining({ title: 'Question1'}),
				expect.objectContaining({ title: 'Question2'}),
				expect.objectContaining({ title: 'Question3'})
			]
		});
	});
});