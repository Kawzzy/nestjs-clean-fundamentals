import { Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { CacheModule } from '@/infra/cache/cache.module';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { DatabaseModule } from '@/infra/database/database.module';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { PrismaQuestionsRepository } from './prisma-questions-repository';
import { RedisCacheRepository } from '@/infra/cache/redis/redis-cache-repository';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments';

describe('Prisma questions repository (E2E)', () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let attachmentFactory: AttachmentFactory;
	let questionAttachmentFactory: QuestionAttachmentFactory;
	let cacheRepository: RedisCacheRepository;
	let questionsRepository: PrismaQuestionsRepository;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				AppModule,
				CacheModule,
				DatabaseModule
			],
			providers: [
				StudentFactory,
				QuestionFactory,
				AttachmentFactory,
				RedisCacheRepository,
				PrismaQuestionsRepository,
				QuestionAttachmentFactory
			]
		}).compile();

		app = moduleRef.createNestApplication();
        
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
		cacheRepository = moduleRef.get(RedisCacheRepository);
		questionsRepository = moduleRef.get(PrismaQuestionsRepository);

		await app.init();
	});

	it('should cache question details', async () => {

		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const attachment = await attachmentFactory.makePrismaAttachment();

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment.id,
			questionId: question.id
		});

		const slug = question.slug.value;

		const questionDetails = await questionsRepository.findDetailsBySlug(slug);

		const cached = await cacheRepository.get(`question:${slug}:details`);

		expect(cached).toEqual(JSON.stringify(questionDetails));
	});

	it('should return cached question details on subsequent calls', async () => {

		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const attachment = await attachmentFactory.makePrismaAttachment();

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment.id,
			questionId: question.id
		});

		const slug = question.slug.value;

		await cacheRepository.set(`question:${slug}:details`, JSON.stringify({ empty: true }));

		const questionDetails = await questionsRepository.findDetailsBySlug(slug);

		expect(questionDetails).toEqual({ empty: true });
	});

	it('should reset question details cache when saving the question', async () => {

		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const attachment = await attachmentFactory.makePrismaAttachment();

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment.id,
			questionId: question.id
		});

		const slug = question.slug.value;

		await cacheRepository.set(`question:${slug}:details`, JSON.stringify({ empty: true }));

		await questionsRepository.save(question);

		const cached = await cacheRepository.get(`question:${slug}:details`);

		expect(cached).toBeNull();
	});
});