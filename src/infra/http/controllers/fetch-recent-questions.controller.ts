import { z } from 'zod';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

const pageValidationParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageValidationParamSchema);

type PageValidationParamSchema = z.infer<typeof pageValidationParamSchema>

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class FetchRecentQuestionsController {
	constructor(private prismaConnection: PrismaService) {}

    @Get()
	async handle(@Query('page', queryValidationPipe) page: PageValidationParamSchema) {
		const perPage = 20;

		const questions = await this.prismaConnection.question.findMany({
			take: perPage,
			skip: (page - 1) * perPage,
			orderBy: {
				createdAt: 'desc'
			}
		});

		return { questions };
	}
}