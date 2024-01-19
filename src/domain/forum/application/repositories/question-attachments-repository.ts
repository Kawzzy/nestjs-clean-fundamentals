import { QuestionAttachment } from '../../enterprise/entities/question-attachment';

export interface QuestionAttachmentsRepository {
  createMany(attachments: QuestionAttachment[]): Promise<void>
  deleteMany(attachments: QuestionAttachment[]): Promise<void>
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
  deleteManyByQuestionId(questionId: string): Promise<void>
}
