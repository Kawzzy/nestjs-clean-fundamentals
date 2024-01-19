import request from 'supertest';

import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { StudentFactory } from 'test/factories/make-student';
import { DatabaseModule } from '@/infra/database/database.module';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Create question (E2E)', () => {
	let app: INestApplication;
	let prismaConnection: PrismaService;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let attachmentFactory: AttachmentFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				AppModule,
				DatabaseModule
			],
			providers: [
				StudentFactory,
				AttachmentFactory
			]
		}).compile();

		app = moduleRef.createNestApplication();
        
		prismaConnection = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);
		studentFactory = moduleRef.get(StudentFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);

		await app.init();
	});

	test('[POST] /questions', async () => {

		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const attachment1 = await attachmentFactory.makePrismaAttachment();
		const attachment2 = await attachmentFactory.makePrismaAttachment();

		const response = await request(app.getHttpServer())
			.post('/questions')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'New Question',
				content: 'Question Content',
				attachmentsIds: [attachment1.id.toString(), attachment2.id.toString()]
			});

		expect(response.statusCode).toBe(201);

		const questionOnDatabase = await prismaConnection.question.findFirst({
			where: {
				title: 'New Question'
			}
		});

		expect(questionOnDatabase).toBeTruthy();

		const attachmentsOnDatabase = await prismaConnection.attachment.findMany({
			where: {
				questionId: questionOnDatabase?.id
			}
		});

		expect(attachmentsOnDatabase).toHaveLength(2);
	});
});