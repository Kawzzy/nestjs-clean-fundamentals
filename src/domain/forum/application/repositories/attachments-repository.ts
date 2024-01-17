import { Attachment } from '../../enterprise/entities/attachment';

export interface AttachmentsRepository {
    create(attachment: Attachment): Promise<void>
}