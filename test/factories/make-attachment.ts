import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Attachment, AttachmentProps } from '@/domain/forum/enterprise/entities/attachment';
import { PrismaAttachmentsMapper } from '@/infra/database/prisma/mappers/prisma-attachment.mapper';

export function makeAttachment(override: Partial<AttachmentProps> = {}, id?: UniqueEntityID) {
	const question = Attachment.create(
		{
			title: faker.lorem.slug(),
			url: faker.lorem.slug(),
			...override,
		},
		id,
	);

	return question;
}

@Injectable()
export class AttachmentFactory {
	constructor(private prismaConnection: PrismaService) {}

	async makePrismaAttachment(data: Partial<AttachmentProps> = {}): Promise<Attachment> {
		const attachment = makeAttachment(data);

		await this.prismaConnection.attachment.create({
			data: PrismaAttachmentsMapper.toPrisma(attachment)
		});

		return attachment;
	}
}