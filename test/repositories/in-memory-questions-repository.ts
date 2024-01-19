import { DomainEvents } from '@/core/events/domain-events';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = [];

	constructor(
		private inMemoryStudentsRepository: InMemoryStudentsRepository,
		private inMemoryAttachmentsRepository: InMemoryAttachmentsRepository,
		private inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
	) {}

	async findById(id: string) {
		const question = this.items.find((item) => item.id.toString() === id);

		if (!question) {
			return null;
		}

		return question;
	}

	async findBySlug(slug: string) {
		const question = this.items.find((item) => item.slug.value === slug);

		if (!question) {
			return null;
		}

		return question;
	}

	async findDetailsBySlug(slug: string) {
		const question = this.items.find((item) => item.slug.value === slug);

		if (!question) {
			return null;
		}
		
		const author = this.inMemoryStudentsRepository.items.find(student => {
			return student.id.equals(question.authorId);
		});
		
		if (!author) {
			throw new Error(`Author with ID "${question.authorId.toString()}" doesn't exist.`);
		}
		
		const questionAttachments = this.inMemoryQuestionAttachmentsRepository.items.filter(questionAtt => {
			return questionAtt.questionId.equals(question.id);
		});

		const attachments = questionAttachments.map(questionAtt => {
			const attachment = this.inMemoryAttachmentsRepository.attachments.find(att => {
				return att.id.equals(questionAtt.attachmentId);
			});
			
			if (!attachment) {
				throw new Error(`Attachment with ID "${questionAtt.attachmentId.toString()}" doesn't exist.`);
			}
			
			return attachment;
		});
		
		return QuestionDetails.create({
			questionId: question.id,
			authorId: question.authorId,
			author: author.name,
			title: question.title,
			slug: question.slug,
			content: question.content,
			bestAnswerId: question.bestAnswerId,
			attachments,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		});
	}

	async findManyRecent({ page }: PaginationParams) {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);

		return questions;
	}

	async create(question: Question) {
		this.items.push(question);

		await this.inMemoryQuestionAttachmentsRepository.createMany(
			question.attachments.getItems()
		);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async save(question: Question) {
		const itemIndex = this.items.findIndex((item) => item.id === question.id);

		this.items[itemIndex] = question;

		await this.inMemoryQuestionAttachmentsRepository.createMany(
			question.attachments.getNewItems()
		);

		await this.inMemoryQuestionAttachmentsRepository.deleteMany(
			question.attachments.getRemovedItems()
		);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async delete(question: Question) {
		const itemIndex = this.items.findIndex((item) => item.id === question.id);

		this.items.splice(itemIndex, 1);

		this.inMemoryQuestionAttachmentsRepository.deleteManyByQuestionId(
			question.id.toString(),
		);
	}
}
