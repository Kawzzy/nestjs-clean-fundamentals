import request from 'supertest';

import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { AnswerFactory } from 'test/factories/make-answer';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Comment on answer (E2E)', () => {
	let app: INestApplication;
	let prismaConnection: PrismaService;
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
        
		prismaConnection = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		answerFactory = moduleRef.get(AnswerFactory);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);

		await app.init();
	});

	test('[POST] /answers/:answerId/comments', async () => {

		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id
		});

		const answer = await answerFactory.makePrismaAnswer({
			questionId: question.id,
			authorId: user.id
		});

		const answerId = answer.id.toString();

		const response = await request(app.getHttpServer())
			.post(`/answers/${answerId}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				content: 'New answer comment'
			});

		expect(response.statusCode).toBe(201);
			
		const commentOnDatabase = await prismaConnection.comment.findFirst({
			where: {
				content: 'New answer comment'
			}
		});

		expect(commentOnDatabase).toBeTruthy();
	});
});