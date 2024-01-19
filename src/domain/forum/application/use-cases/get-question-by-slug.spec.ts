import { makeStudent } from 'test/factories/make-student';
import { makeQuestion } from 'test/factories/make-question';
import { makeAttachment } from 'test/factories/make-attachment';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { makeQuestionAttachment } from 'test/factories/make-question-attachments';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryStudentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryQuestionAttachmentsRepository,
		);

		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
	});

	it('should be able to get a question by slug', async () => {

		const studentName = 'John Doe';

		const student = makeStudent({ name: studentName });

		inMemoryStudentsRepository.items.push(student);

		const newQuestion = makeQuestion({
			authorId: student.id,
			slug: Slug.create('example-question')
		});

		await inMemoryQuestionsRepository.create(newQuestion);

		const attachment = makeAttachment({ title: 'New attachment' });

		inMemoryAttachmentsRepository.attachments.push(attachment);

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				attachmentId: attachment.id,
				questionId: newQuestion.id
			})
		);

		const result = await sut.execute({
			slug: 'example-question',
		});

		expect(result.value).toMatchObject({
			question: expect.objectContaining({
				title: newQuestion.title,
				author: 'John Doe',
				attachments: [
					expect.objectContaining({
						title: 'New attachment'
					})
				]
			}),
		});
	});
});
