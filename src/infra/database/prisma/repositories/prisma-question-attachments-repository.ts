import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment.mapper';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentsRepository {

	constructor(private prismaConnection: PrismaService) {}

	async createMany(attachments: QuestionAttachment[]): Promise<void> {
		if (attachments.length === 0) {
			return;
		}

		const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments);

		await this.prismaConnection.attachment.updateMany(data);
	}

	async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
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

	async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
		const questionAttachments = await this.prismaConnection.attachment.findMany({
			where: {
				questionId
			}
		});

		return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain);
	}
    
	async deleteManyByQuestionId(questionId: string): Promise<void> {
		await this.prismaConnection.attachment.deleteMany({
			where: {
				questionId
			}
		});
	}
}