import request from 'supertest';

import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { AnswerFactory, AnswerFactory } from 'test/factories/make-answer';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Edit answer (E2E)', () => {
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
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);

		await app.init();
	});

	test('[PUT] /answers/:id', async () => {

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
			.put(`/answers/${answerId}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				content: 'New answer content'
			});

		expect(response.statusCode).toBe(204);
			
		const answerOnDatabase = await prismaConnection.answer.findFirst({
			where: {
				content: 'New answer content'
			}
		});

		expect(answerOnDatabase).toBeTruthy();
	});
});