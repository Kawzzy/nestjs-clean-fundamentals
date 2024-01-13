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
		throw new Error('Method not implemented.');
	}

	async findManyRecent(params: PaginationParams): Promise<Question[]> {
		throw new Error('Method not implemented.');
	}

	async save(question: Question): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async create(question: Question): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async delete(question: Question): Promise<void> {
		throw new Error('Method not implemented.');
	}
}