import { PaginationParams } from '@/core/repositories/pagination-params';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details';

export interface QuestionsRepository {
  
  findById(id: string): Promise<Question | null>
  
  findBySlug(slug: string): Promise<Question | null>
  
  findDetailsBySlug(slug: string): Promise<QuestionDetails | null>
  
  findManyRecent(params: PaginationParams): Promise<Question[]>
  
  save(question: Question): Promise<void>
  
  create(question: Question): Promise<void>
  
  delete(question: Question): Promise<void>
}
