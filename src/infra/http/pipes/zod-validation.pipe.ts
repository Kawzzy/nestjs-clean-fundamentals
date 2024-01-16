import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodSchema) {}

	transform(value: unknown, metadata: ArgumentMetadata) {
		// doing this validation, I won't have problems when I use @UsePipes to validate
		// a @Body, @Param nor @Query with zod
		if (metadata.type === 'custom' || metadata.type === 'param') {
			return value;
		}
		
		try {
			value = this.schema.parse(value);
		} catch (error) {
			if (error instanceof ZodError) {
				throw new BadRequestException({
					statusCode: 400,
					message: 'Validation failed!',
					errors: fromZodError(error)
				});
			}

			throw new BadRequestException('Validation failed!');
		}

		return value;
	}    
}