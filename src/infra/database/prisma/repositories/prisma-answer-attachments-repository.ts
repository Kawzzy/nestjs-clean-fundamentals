import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment.mapper';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {

	constructor(private prismaConnection: PrismaService) {}

	async createMany(attachments: AnswerAttachment[]): Promise<void> {
		if (attachments.length === 0) {
			return;
		}

		const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments);

		await this.prismaConnection.attachment.updateMany(data);
	}

	async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
		if (attachments.length === 0) {
			return;
		}

		const attachmentsIds = attachments.map(att => att.id.toString());

		await this.prismaConnection.attachment.deleteMany({
			where: {
				id: {
					in: attachmentsIds
				}
			}
		});
	}

	async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
		const answerAttachments = await this.prismaConnection.attachment.findMany({
			where: {
				answerId
			}
		});

		return answerAttachments.map(PrismaAnswerAttachmentMapper.toDomain);
	}

	async deleteManyByAnswerId(answerId: string): Promise<void> {
		await this.prismaConnection.attachment.deleteMany({
			where: {
				answerId
			}
		});
	}
}