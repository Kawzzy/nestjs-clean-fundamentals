import { Either, right } from '@/core/either';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<null, { comments: CommentWithAuthor[] }>

export class FetchAnswerCommentsUseCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({ answerId, page}: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
		const comments = await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(answerId, { page });

		return right({
			comments,
		});
	}
}
