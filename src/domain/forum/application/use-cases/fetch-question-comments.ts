import { Either, right } from '@/core/either';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';

interface FetchQuestionCommentsUseCaseRequest {
	questionId: string
	page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<null, { comments: CommentWithAuthor[] }>

export class FetchQuestionCommentsUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({ questionId, page}: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const comments = await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(questionId, { page });

		return right({
			comments,
		});
	}
}
