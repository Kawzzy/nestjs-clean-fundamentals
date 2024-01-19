import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { PrismaAnswerMapper } from '../mappers/prisma-answer.mapper';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { PrismaAnswerAttachmentsRepository } from './prisma-answer-attachments-repository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {

	constructor(
		private prismaConnection: PrismaService,
		private answerAttachmentsRepository: PrismaAnswerAttachmentsRepository
	) {}
	
	async findById(id: string): Promise<Answer | null> {
		const answer = await this.prismaConnection.answer.findUnique({
			where: {
				id
			}
		});

		return answer ? PrismaAnswerMapper.toDomain(answer) : null;
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
		const answers = await this.prismaConnection.answer.findMany({
			where: {
				questionId
			},
			orderBy: {
				createdAt: 'desc'
			},
			take: 20,
			skip: (page - 1) * 20
		});

		return answers.map(PrismaAnswerMapper.toDomain);
	}

	async create(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPrisma(answer);
	
		await this.prismaConnection.answer.create({
			data
		});

		await this.answerAttachmentsRepository.createMany(
			answer.attachments.getItems()
		);
	}

	async save(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPrisma(answer);
	
		await Promise.all([
			this.prismaConnection.answer.update({
				where: {
					id: data.id
				},
				data
			}),
			this.answerAttachmentsRepository.createMany(
				answer.attachments.getNewItems()
			),
			this.answerAttachmentsRepository.deleteMany(
				answer.attachments.getRemovedItems()
			)
		]);
	}

	async delete(answer: Answer): Promise<void> {
		await this.prismaConnection.answer.delete({
			where: {
				id: answer.id.toString()
			}
		});
	}
}