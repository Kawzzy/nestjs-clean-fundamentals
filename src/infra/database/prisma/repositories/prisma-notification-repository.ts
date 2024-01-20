import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaNotificationMapper } from '../mappers/prisma-notification.mapper';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
	
	constructor(private prismaConnection: PrismaService) {}

	async findById(id: string): Promise<Notification | null> {
		const notification = await this.prismaConnection.notification.findUnique({
			where: {
				id
			}
		});

		return notification ? PrismaNotificationMapper.toDomain(notification) : null;
	}
    
	async create(notification: Notification): Promise<void> {
		const data = PrismaNotificationMapper.toPrisma(notification);
	
		await this.prismaConnection.notification.create({
			data
		});
	}

	async save(notification: Notification): Promise<void> {
		const data = PrismaNotificationMapper.toPrisma(notification);

		await this.prismaConnection.notification.update({
			where: {
				id: data.id
			},
			data
		});
	}
}