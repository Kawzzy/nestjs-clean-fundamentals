import { Student } from '@/domain/forum/enterprise/entities/student';

export interface StudentsRepository {
    findByEmail(email: string): Promise<Student | null>
    create(student: Student): Promise<void>
}