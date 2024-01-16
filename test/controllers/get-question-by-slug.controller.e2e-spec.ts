import request from 'supertest';

import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Get question by slug (E2E)', () => {
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

	test('[GET] /questions/:slug', async () => {

		const user = await prismaConnection.user.create({
			data: {
				name: 'Tester',
				email: 'tester@test.com',
				password: 'test123'
			}
		});

		const accessToken = jwt.sign({ sub: user.id });

		const slug = 'question1';

		await prismaConnection.question.create({
			data: {
				authorId: user.id,
				title: 'Question1',
				slug,
				content: 'question content 1'
			}
		});

		const response = await request(app.getHttpServer())
			.get(`/questions/${slug}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			question: expect.objectContaining({ title: 'Question1'})
		});
	});
});