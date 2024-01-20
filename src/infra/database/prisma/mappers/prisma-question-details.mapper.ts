import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PrismaAttachmentsMapper } from './prisma-attachment.mapper';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { Attachment as PrismaAttachment, Question as PrismaQuestion, User as PrismaUser } from '@prisma/client';

type PrismaQuestionDetails = PrismaQuestion & {
    author: PrismaUser,
    attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {

	static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
		return QuestionDetails.create({
			questionId: new UniqueEntityID(raw.id),
			authorId: new UniqueEntityID(raw.authorId),
			author: raw.author.name,
			title: raw.title,
			slug: Slug.create(raw.slug),
			attachments: raw.attachments.map(PrismaAttachmentsMapper.toDomain),
			bestAnswerId: raw.bestAnswerId ? new UniqueEntityID(raw.bestAnswerId) : null,
			content: raw.content,
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt
		});
	}
}