import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

export interface QuestionCommentsRepository {
  findById(id: string): Promise<QuestionComment | null>

  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
  
  findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>
  
  create(questionComment: QuestionComment): Promise<void>
  
  delete(questionComment: QuestionComment): Promise<void>
}
