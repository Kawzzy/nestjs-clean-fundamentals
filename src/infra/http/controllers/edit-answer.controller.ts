import { z } from 'zod';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';
import { BadRequestException, Body, Controller, HttpCode, Param, Put, UsePipes } from '@nestjs/common';

const editAnswerBodySchema = z.object({
	content: z.string(),
	attachmentsIds: z.array(z.string().uuid())
});

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

@Controller('/answers/:id')
export class EditAnswerController {
	constructor(private editAnswer: EditAnswerUseCase) {}
	
	@Put()
    @HttpCode(204)
	@UsePipes(new ZodValidationPipe(editAnswerBodySchema))
	async handle(@Body() body: EditAnswerBodySchema, @CurrentUser() user: UserPayload, @Param('id') answerId: string) {
		const { content, attachmentsIds } = body;
		const userId = user.sub;

		const result = await this.editAnswer.execute({
			content,
			answerId,
			authorId: userId,
			attachmentsIds
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
