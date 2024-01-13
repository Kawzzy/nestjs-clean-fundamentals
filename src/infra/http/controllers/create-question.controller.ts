import { z } from 'zod';
import { AuthGuard } from '@nestjs/passport';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
	constructor(private prismaConnection: PrismaService) {}
	
	@Post()
	@UsePipes(new ZodValidationPipe(createQuestionBodySchema))
	async handle(@Body() body: CreateQuestionBodySchema, @CurrentUser() user: UserPayload) {
		const { title, content } = body;
		const userId = user.sub;

		await this.prismaConnection.question.create({
			data: {
				authorId: userId,
				title,
				content,
				slug: 'asdf'
			}
		});
	}
}
