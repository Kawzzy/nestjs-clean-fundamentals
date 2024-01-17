import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

export interface AttachmentsRepository {
    create(attachment: Attachment): Promise<void>
}