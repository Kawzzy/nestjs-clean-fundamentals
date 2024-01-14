import { FakeHasher } from 'test/cryptography/fake-hasher';
import { RegisterStudentUseCase } from './register-student';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;

let sut: RegisterStudentUseCase;

describe('Register Student', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository(),
		fakeHasher = new FakeHasher();

		sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
	});

	it('should be able to register a student', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@test.com',
			password: '123456'
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			student: inMemoryStudentsRepository.items[0]
		});
	});

	it('should hash student\'s password upon registration',async () => {
		const password = '123456';
		
		const result = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@test.com',
			password
		});

		const hashedPassword = await fakeHasher.hash(password);

		expect(result.isRight()).toBe(true);
		expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword);
	});
});
