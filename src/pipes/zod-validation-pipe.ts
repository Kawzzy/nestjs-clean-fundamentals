import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodSchema) {}

	transform(value: any) {
		try {
			this.schema.parse(value);
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