import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

export interface AnswerCommentsRepository {
  
  findById(id: string): Promise<AnswerComment | null>
  
  findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]>
  
  findManyByAnswerIdWithAuthor(answerId: string, params: PaginationParams): Promise<CommentWithAuthor[]>
  
  create(answerComment: AnswerComment): Promise<void>
  
  delete(answerComment: AnswerComment): Promise<void>
}
