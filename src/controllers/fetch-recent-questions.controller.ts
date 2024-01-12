import { z } from 'zod';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '@/prisma/prisma.service';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';

const pageValidationParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageValidationParamSchema);

type PageValidationParamSchema = z.infer<typeof pageValidationParamSchema>

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class FetchRecentQuestionsController {
	constructor(private prismaConnection: PrismaService) {}

    @Get()
	async handle(@Query('page', queryValidationPipe) page: PageValidationParamSchema) {
		const questions = await this.prismaConnection.question.findMany({
			take: 1,
			skip: (page - 1) * 1,
			orderBy: {
				createdAt: 'desc'
			}
		});

		return { questions };
	}
}