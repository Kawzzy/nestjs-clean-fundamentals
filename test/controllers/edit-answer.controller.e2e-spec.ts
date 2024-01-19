import request from 'supertest';

import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { AnswerFactory } from 'test/factories/make-answer';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { DatabaseModule } from '@/infra/database/database.module';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AnswerAttachmentFactory } from 'test/factories/make-answer-attachments';

describe('Edit answer (E2E)', () => {
	let app: INestApplication;
	let prismaConnection: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;
	let attachmentFactory: AttachmentFactory;
	let answerAttachmentFactory: AnswerAttachmentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				AppModule,
				DatabaseModule
			],
			providers: [
				AnswerFactory,
				StudentFactory,
				QuestionFactory,
				AttachmentFactory,
				AnswerAttachmentFactory
			]
		}).compile();

		app = moduleRef.createNestApplication();
        
		prismaConnection = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);

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

		const attachment1 = await attachmentFactory.makePrismaAttachment();
		const attachment2 = await attachmentFactory.makePrismaAttachment();

		await answerAttachmentFactory.makePrismaAnswerAttachment({
			answerId: answer.id,
			attachmentId: attachment1.id
		});

		await answerAttachmentFactory.makePrismaAnswerAttachment({
			answerId: answer.id,
			attachmentId: attachment2.id
		});

		const attachment3 = await attachmentFactory.makePrismaAttachment();

		const response = await request(app.getHttpServer())
			.put(`/answers/${answerId}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				content: 'New answer content',
				attachmentsIds: [attachment1.id.toString(), attachment3.id.toString()]
			});

		expect(response.statusCode).toBe(204);
			
		const answerOnDatabase = await prismaConnection.answer.findFirst({
			where: {
				content: 'New answer content'
			}
		});

		expect(answerOnDatabase).toBeTruthy();

		const attachmentsOnDatabase = await prismaConnection.attachment.findMany({
			where: {
				answerId: answerOnDatabase?.id
			}
		});

		expect(attachmentsOnDatabase).toHaveLength(2);
		expect(attachmentsOnDatabase).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: attachment1.id.toString()
				}),
				expect.objectContaining({
					id: attachment3.id.toString()
				})
			])
		);
	});
});