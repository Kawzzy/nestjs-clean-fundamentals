import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { PrismaAttachmentsMapper } from '../mappers/prisma-attachment.mapper';
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
	
	constructor(private prismaConnection: PrismaService) {}

	async create(attachment: Attachment): Promise<void> {
		const data = PrismaAttachmentsMapper.toPrisma(attachment);

		await this.prismaConnection.attachment.create({
			data
		});
	}
}