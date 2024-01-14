import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { PrismaStudentMapper } from '../mappers/prisma-student.mapper';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
	
	constructor(private prismaConnection: PrismaService) {}

	async findByEmail(email: string): Promise<Student | null> {
		const student = await this.prismaConnection.user.findUnique({
			where: {
				email
			}
		});

		return student ? PrismaStudentMapper.toDomain(student) : null;
	}
	
	async create(student: Student): Promise<void> {
		const data = PrismaStudentMapper.toPrisma(student);
	
		await this.prismaConnection.user.create({
			data
		});
	}
}