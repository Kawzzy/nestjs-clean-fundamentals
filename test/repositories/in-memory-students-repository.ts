import { DomainEvents } from '@/core/events/domain-events';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';

export class InMemoryStudentsRepository implements StudentsRepository {
	public items: Student[] = [];

	async findByEmail(email: string) {
		const question = this.items.find((item) => item.email === email);

		if (!question) {
			return null;
		}

		return question;
	}

	async create(question: Student) {
		this.items.push(question);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}
}
