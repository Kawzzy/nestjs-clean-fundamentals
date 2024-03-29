import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question as PrismaQuestion, Prisma } from '@prisma/client';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';

export class PrismaQuestionMapper {

	static toDomain(raw: PrismaQuestion): Question {
		return Question.create({
			title: raw.title,
			content: raw.content,
			slug: Slug.create(raw.slug),
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
			bestAnswerId: raw.bestAnswerId ? new UniqueEntityID(raw.bestAnswerId) : null,
			authorId: new UniqueEntityID(raw.authorId)
		}, new UniqueEntityID(raw.id));
	}

	static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
		return {
			id: question.id.toString(),
			title: question.title,
			content: question.content,
			slug: question.slug.value,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
			authorId: question.authorId.toString(),
			bestAnswerId: question.bestAnswerId?.toString()
		};
	}
}