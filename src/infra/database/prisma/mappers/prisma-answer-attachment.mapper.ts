import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Prisma, Attachment as PrismaComment } from '@prisma/client';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class PrismaAnswerAttachmentMapper {

	static toDomain(raw: PrismaComment): AnswerAttachment {
		if (!raw.answerId) {
			throw new Error('Invalid attachment type.');
		}

		return AnswerAttachment.create({
			attachmentId: new UniqueEntityID(raw.id),
			answerId: new UniqueEntityID(raw.answerId)
		}, new UniqueEntityID(raw.id));
	}

	static toPrismaUpdateMany(attachments: AnswerAttachment[]): Prisma.AttachmentUpdateManyArgs {
		const attachmentsIds = attachments.map(att => att.attachmentId.toString());

		return {
			where: {
				id: {
					in: attachmentsIds
				}
			},
			data: {
				answerId: attachments[0].answerId.toString()
			}
		};
	}
}