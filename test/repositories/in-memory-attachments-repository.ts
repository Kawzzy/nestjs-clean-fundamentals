import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
	public attachments: Attachment[] = [];

	async create(attachment: Attachment): Promise<void> {
		this.attachments.push(attachment);
	}
}