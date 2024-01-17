import request from 'supertest';

import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Comment on question (E2E)', () => {
	let app: INestApplication;
	let prismaConnection: PrismaService;
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
        
		prismaConnection = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);

		await app.init();
	});

	test('[POST] /questions/:questionId/comments', async () => {

		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id
		});

		const questionId = question.id.toString();

		const response = await request(app.getHttpServer())
			.post(`/questions/${questionId}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				content: 'New comment'
			});

		expect(response.statusCode).toBe(201);
			
		const commentOnDatabase = await prismaConnection.comment.findFirst({
			where: {
				content: 'New comment'
			}
		});

		expect(commentOnDatabase).toBeTruthy();
	});
});