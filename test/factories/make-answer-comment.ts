import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AnswerComment,	AnswerCommentProps} from '@/domain/forum/enterprise/entities/answer-comment';
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment.mapper';

export function makeAnswerComment(override: Partial<AnswerCommentProps> = {}, id?: UniqueEntityID) {
	const answer = AnswerComment.create(
		{
			authorId: new UniqueEntityID(),
			answerId: new UniqueEntityID(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return answer;
}

@Injectable()
export class AnswerCommentFactory {
	constructor(private prismaConnection: PrismaService) {}

	async makePrismaAnswerComment(data: Partial<AnswerCommentProps> = {}): Promise<AnswerComment> {
		const answerComment = makeAnswerComment(data);

		await this.prismaConnection.comment.create({
			data: PrismaAnswerCommentMapper.toPrisma(answerComment)
		});

		return answerComment;
	}
}