import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment.mapper';
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author.mapper';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';

@Injectable()
export class PrismaQuestionCommentRepository implements QuestionCommentsRepository {

	constructor(private prismaConnection: PrismaService) {}

	async findById(id: string): Promise<QuestionComment | null> {
		const questionComment = await this.prismaConnection.comment.findUnique({
			where: {
				id
			}
		});

		return questionComment ? PrismaQuestionCommentMapper.toDomain(questionComment) : null;
	}
    
	async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<QuestionComment[]> {
		const questionComments = await this.prismaConnection.comment.findMany({
			where: {
				questionId
			},
			orderBy: {
				createdAt: 'desc'
			},
			take: 20,
			skip: (page - 1) * 20
		});

		return questionComments.map(PrismaQuestionCommentMapper.toDomain);
	}
    
	async findManyByQuestionIdWithAuthor(questionId: string, { page }: PaginationParams): Promise<CommentWithAuthor[]> {
		const comments = await this.prismaConnection.comment.findMany({
			where: {
				questionId
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
    
	async create(questionComment: QuestionComment): Promise<void> {
		const data = PrismaQuestionCommentMapper.toPrisma(questionComment);

		await this.prismaConnection.comment.create({
			data
		});
	}
    
	async delete(questionComment: QuestionComment): Promise<void> {
		await this.prismaConnection.comment.delete({
			where: {
				id: questionComment.id.toString()
			}
		});
	}
}