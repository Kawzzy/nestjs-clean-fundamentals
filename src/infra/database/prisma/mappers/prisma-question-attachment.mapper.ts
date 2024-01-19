import { Prisma, Attachment as PrismaComment } from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class PrismaQuestionAttachmentMapper {

	static toDomain(raw: PrismaComment): QuestionAttachment {
		if (!raw.questionId) {
			throw new Error('Invalid attachment type.');
		}

		return QuestionAttachment.create({
			attachmentId: new UniqueEntityID(raw.id),
			questionId: new UniqueEntityID(raw.questionId)
		}, new UniqueEntityID(raw.id));
	}

	static toPrismaUpdateMany(attachments: QuestionAttachment[]): Prisma.AttachmentUpdateManyArgs {
		const attachmentsIds = attachments.map(att => att.attachmentId.toString());

		return {
			where: {
				id: {
					in: attachmentsIds
				}
			},
			data: {
				questionId: attachments[0].questionId.toString()
			}
		};
	}
}