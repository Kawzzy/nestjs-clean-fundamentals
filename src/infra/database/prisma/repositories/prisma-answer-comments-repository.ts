import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment.mapper';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author.mapper';

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {

	constructor(private prismaConnection: PrismaService) {}

	async findById(id: string): Promise<AnswerComment | null> {
		const answerComment = await this.prismaConnection.comment.findUnique({
			where: {
				id
			}
		});

		return answerComment ? PrismaAnswerCommentMapper.toDomain(answerComment) : null;
	}

	async findManyByAnswerId(answerId: string, { page }: PaginationParams): Promise<AnswerComment[]> {
		const answerComments = await this.prismaConnection.comment.findMany({
			where: {
				answerId
			},
			orderBy: {
				createdAt: 'desc'
			},
			take: 20,
			skip: (page - 1) * 20
		});

		return answerComments.map(PrismaAnswerCommentMapper.toDomain);
	}

	async findManyByAnswerIdWithAuthor(answerId: string, { page }: PaginationParams): Promise<CommentWithAuthor[]> {
		const comments = await this.prismaConnection.comment.findMany({
			where: {
				answerId
			},
			include: {
				author: true
			},
			orderBy: {
				createdAt: 'desc'
			},
			take: 20,
			skip: (page - 1) * 20
		});

		return comments.map(PrismaCommentWithAuthorMapper.toDomain);
	}

	async create(answerComment: AnswerComment): Promise<void> {
		const data = PrismaAnswerCommentMapper.toPrisma(answerComment);

		await this.prismaConnection.comment.create({
			data
		});
	}

	async delete(answerComment: AnswerComment): Promise<void> {
		await this.prismaConnection.comment.delete({
			where: {
				id: answerComment.id.toString()
			}
		});
	}
}