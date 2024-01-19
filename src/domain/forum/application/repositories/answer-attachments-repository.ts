import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';

export interface AnswerAttachmentsRepository {
  createMany(attachments: AnswerAttachment[]): Promise<void>
  deleteMany(attachments: AnswerAttachment[]): Promise<void>
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  deleteManyByAnswerId(answerId: string): Promise<void>
}
