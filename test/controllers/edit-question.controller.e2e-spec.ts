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
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments';

describe('Edit question (E2E)', () => {
	let app: INestApplication;
	let prismaConnection: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let attachmentFactory: AttachmentFactory;
	let questionAttachmentFactory: QuestionAttachmentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				AppModule,
				DatabaseModule
			],
			providers: [
				StudentFactory,
				QuestionFactory,
				AttachmentFactory,
				QuestionAttachmentFactory
			]
		}).compile();

		app = moduleRef.createNestApplication();
        
		prismaConnection = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

		await app.init();
	});

	test('[PUT] /questions/:id', async () => {

		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id
		});
		
		const questionId = question.id.toString();

		const attachment1 = await attachmentFactory.makePrismaAttachment();
		const attachment2 = await attachmentFactory.makePrismaAttachment();
		
		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment1.id,
			questionId: question.id
		});
		
		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment2.id,
			questionId: question.id
		});

		const attachment3 = await attachmentFactory.makePrismaAttachment();

		const response = await request(app.getHttpServer())
			.put(`/questions/${questionId}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'New title',
				content: 'New Content',
				attachmentsIds: [attachment1.id.toString(), attachment3.id.toString()]
			});

		expect(response.statusCode).toBe(204);
			
		const questionOnDatabase = await prismaConnection.question.findFirst({
			where: {
				title: 'New title',
				content: 'New Content'
			}
		});

		expect(questionOnDatabase).toBeTruthy();

		const attachmentsOnDatabase = await prismaConnection.attachment.findMany({
			where: {
				questionId: questionOnDatabase?.id
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