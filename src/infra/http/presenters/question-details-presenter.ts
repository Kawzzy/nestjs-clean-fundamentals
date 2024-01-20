import { AttachmentPresenter } from './attachment-presenter';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

export class HttpQuestionDetailsPresenter {
    
	static toHTTP(questionDetails: QuestionDetails) {
		return {
			questionId: questionDetails.questionId,
			authorId: questionDetails.authorId,
			author: questionDetails.author,
			title: questionDetails.title,
			content: questionDetails.content,
			slug: questionDetails.slug.value,
			bestAnswerId: questionDetails.bestAnswerId?.toString(),
			attachments: questionDetails.attachments.map(AttachmentPresenter.toHTTP),
			createdAt: questionDetails.createdAt,
			updatedAt: questionDetails.updatedAt
		};
	}
}