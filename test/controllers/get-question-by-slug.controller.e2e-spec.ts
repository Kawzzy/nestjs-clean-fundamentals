import request from 'supertest';

import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { DatabaseModule } from '@/infra/database/database.module';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments';

describe('Get question by slug (E2E)', () => {
	let app: INestApplication;
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
        
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

		await app.init();
	});

	test('[GET] /questions/:slug', async () => {

		const userName = 'John Doe'; 
		const user = await studentFactory.makePrismaStudent({ name: userName });

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const questionTitle = 'Question1';
		const slug = 'question1';

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: questionTitle,
			slug: Slug.create(slug)
		});

		const attTitle = 'Att title';

		const attachment = await attachmentFactory.makePrismaAttachment({ title: attTitle });

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment.id,
			questionId: question.id
		});

		const response = await request(app.getHttpServer())
			.get(`/questions/${slug}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			question: expect.objectContaining({ 
				title: questionTitle,
				author: userName,
				attachments: [
					expect.objectContaining({ title: attTitle })
				]
			})
		});
	});
});