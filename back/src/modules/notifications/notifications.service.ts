import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { NotificationLog } from '../../entities/notification-log.entity' // Changed from type import to regular import for decorator usage
import type { PaginationDto } from '../../common/dtos/pagination.dto'
import type { NotificationType } from '../../common/enums'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationLog)
    private readonly notificationRepository: Repository<NotificationLog>
  ) {}

  async create(
    userId: string,
    message: string,
    type: NotificationType
  ): Promise<NotificationLog> {
    const notification = this.notificationRepository.create({
      userId,
      message,
      type,
    })

    return this.notificationRepository.save(notification)
  }

  async findAll(paginationDto: PaginationDto, userId: string) {
    const { page = 1, limit = 10 } = paginationDto
    const skip = (page - 1) * limit

    const [notifications, total] =
      await this.notificationRepository.findAndCount({
        where: { userId },
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      })

    return {
      data: notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async markAsRead(id: string, userId: string): Promise<NotificationLog> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    })

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`)
    }

    notification.read = true
    return this.notificationRepository.save(notification)
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, read: false },
      { read: true }
    )
  }

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.notificationRepository.count({
      where: { userId, read: false },
    })

    return { count }
  }
}
