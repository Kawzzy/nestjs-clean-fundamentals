import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';

@Injectable()
export class PrismaQuestionCommentRepository implements QuestionCommentsRepository {
	findById(id: string): Promise<QuestionComment | null> {
		throw new Error('Method not implemented.');
	}
    
	findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
		throw new Error('Method not implemented.');
	}
    
	create(questionComment: QuestionComment): Promise<void> {
		throw new Error('Method not implemented.');
	}
    
	delete(questionComment: QuestionComment): Promise<void> {
		throw new Error('Method not implemented.');
	}
}