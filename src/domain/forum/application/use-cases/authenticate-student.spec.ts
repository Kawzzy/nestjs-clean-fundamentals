import { makeStudent } from 'test/factories/make-student';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { AuthenticateStudentUseCase } from './authenticate-student';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateStudentUseCase;

describe('Authenticate Student', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository(),
		fakeHasher = new FakeHasher();
		fakeEncrypter = new FakeEncrypter();

		sut = new AuthenticateStudentUseCase(inMemoryStudentsRepository, fakeHasher, fakeEncrypter);
	});

	it('should be able to authenticate a student', async () => {
		const password = '123456';

		const student = makeStudent({
			email: 'johndoe@test.com',
			password: await fakeHasher.hash(password)
		});

		inMemoryStudentsRepository.items.push(student);

		const result = await sut.execute({
			email: 'johndoe@test.com',
			password
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			accessToken: expect.any(String)
		});
	});
});
