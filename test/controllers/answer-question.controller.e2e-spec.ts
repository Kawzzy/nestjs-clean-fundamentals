import request from 'supertest';

import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { DatabaseModule } from '@/infra/database/database.module';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Answer question (E2E)', () => {
	let app: INestApplication;
	let prismaConnection: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let attachmentFactory: AttachmentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				AppModule,
				DatabaseModule
			],
			providers: [
				StudentFactory,
				QuestionFactory,
				AttachmentFactory
			]
		}).compile();

		app = moduleRef.createNestApplication();
        
		prismaConnection = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		attachmentFactory= moduleRef.get(AttachmentFactory);

		await app.init();
	});

	test('[POST] /questions/:questionId/answers', async () => {

		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id
		});

		const questionId = question.id.toString();

		const attachment1 = await attachmentFactory.makePrismaAttachment();
		const attachment2 = await attachmentFactory.makePrismaAttachment();

		const response = await request(app.getHttpServer())
			.post(`/questions/${questionId}/answers`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				content: 'New answer',
				attachmentsIds: [attachment1.id.toString(), attachment2.id.toString()]
			});

		expect(response.statusCode).toBe(201);
			
		const answerQuestionOnDatabase = await prismaConnection.answer.findFirst({
			where: {
				content: 'New answer'
			}
		});

		expect(answerQuestionOnDatabase).toBeTruthy();

		const attachmentsOnDatabase = await prismaConnection.attachment.findMany({
			where: {
				answerId: answerQuestionOnDatabase?.id
			}
		});

		expect(attachmentsOnDatabase).toHaveLength(2);
	});
});