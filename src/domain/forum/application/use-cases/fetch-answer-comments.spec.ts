import { makeStudent } from 'test/factories/make-student';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch Answer Comments', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository);
		sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
	});

	it('should be able to fetch answer comments', async () => {

		const studentName = 'John Doe';

		const student = makeStudent({ name: studentName });

		inMemoryStudentsRepository.items.push(student);

		const comment1 = makeAnswerComment({
			answerId: new UniqueEntityID('answer-1'),
			authorId: student.id
		});

		const comment2 = makeAnswerComment({
			answerId: new UniqueEntityID('answer-1'),
			authorId: student.id
		});

		const comment3 = makeAnswerComment({
			answerId: new UniqueEntityID('answer-1'),
			authorId: student.id
		});

		await inMemoryAnswerCommentsRepository.create(comment1);
		await inMemoryAnswerCommentsRepository.create(comment2);
		await inMemoryAnswerCommentsRepository.create(comment3);

		const result = await sut.execute({
			answerId: 'answer-1',
			page: 1,
		});

		expect(result.value?.comments).toHaveLength(3);
		expect(result.value?.comments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					author: studentName,
					commentId: comment1.id
				}),
				expect.objectContaining({
					author: studentName,
					commentId: comment2.id
				}),
				expect.objectContaining({
					author: studentName,
					commentId: comment3.id
				})
			])
		);
	});

	it('should be able to fetch paginated answer comments', async () => {
		const studentName = 'John Doe';

		const student = makeStudent({ name: studentName });
		
		inMemoryStudentsRepository.items.push(student);

		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({
					answerId: new UniqueEntityID('answer-1'),
					authorId: student.id
				}),
			);
		}

		const result = await sut.execute({
			answerId: 'answer-1',
			page: 2,
		});

		expect(result.value?.comments).toHaveLength(2);
	});
});
