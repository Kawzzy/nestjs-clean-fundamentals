import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { PrismaQuestionMapper } from '../mappers/prisma-question.mapper';
import { RedisCacheRepository } from '@/infra/cache/redis/redis-cache-repository';
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details.mapper';
import { PrismaQuestionAttachmentsRepository } from './prisma-question-attachments-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	
	constructor(
		private prismaConnection: PrismaService,
		private cacheRepository: RedisCacheRepository,
		private questionAttachmentsRepository: PrismaQuestionAttachmentsRepository
	) {}

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

	async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {

		const cacheHit = await this.cacheRepository.get(`question:${slug}:details`);

		if (cacheHit) {
			const cachedData = JSON.parse(cacheHit);

			return cachedData;
		}

		const question = await this.prismaConnection.question.findUnique({
			where: {
				slug
			},
			include: {
				author: true,
				attachments: true
			}
		});

		if (!question) {
			return null;
		}

		const questionDetails = PrismaQuestionDetailsMapper.toDomain(question);

		await this.cacheRepository.set(`question:${slug}:details`, JSON.stringify(questionDetails));
		
		return questionDetails;
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
	
		await Promise.all([
			this.prismaConnection.question.update({
				where: {
					id: data.id
				},
				data
			}),
			this.questionAttachmentsRepository.createMany(
				question.attachments.getNewItems()
			),
			this.questionAttachmentsRepository.deleteMany(
				question.attachments.getRemovedItems()
			),
			this.cacheRepository.delete(`question:${data.slug}:details`)
		]);
	}
	
	async create(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(question);
	
		await this.prismaConnection.question.create({
			data
		});

		await this.questionAttachmentsRepository.createMany(
			question.attachments.getItems()
		);
	}

	async delete(question: Question): Promise<void> {
		await this.prismaConnection.question.delete({
			where: {
				id: question.id.toString()
			}
		});
	}
}