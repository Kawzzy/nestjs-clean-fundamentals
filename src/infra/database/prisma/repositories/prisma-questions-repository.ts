import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { PrismaQuestionMapper } from '../mappers/prisma-question.mapper';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	
	constructor(private prismaConnection: PrismaService) {}

	async findById(id: string): Promise<Question | null> {
		const question = await this.prismaConnection.question.findUnique({
			where: {
				id
			}
		});

		return question ? PrismaQuestionMapper.toDomain(question) : null;
	}

	async findBySlug(slug: string): Promise<Question | null> {
		const question = await this.prismaConnection.question.findUnique({
			where: {
				slug
			}
		});

		return question ? PrismaQuestionMapper.toDomain(question) : null;
	}

	async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = await this.prismaConnection.question.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			take: 20,
			skip: (page - 1) * 20
		});

		return questions.map(PrismaQuestionMapper.toDomain);
	}

	async save(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(question);
	
		await this.prismaConnection.question.update({
			where: {
				id: data.id
			},
			data
		});
	}
	
	async create(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(question);
	
		await this.prismaConnection.question.create({
			data
		});
	}

	async delete(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(question);
	
		await this.prismaConnection.question.delete({
			where: {
				id: data.id
			}
		});
	}
}