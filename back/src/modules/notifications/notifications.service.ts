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
    console.log(`NotificationService: Marking notification ${id} as read for user ${userId}`)
    
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    })

    if (!notification) {
      console.log(`NotificationService: Notification ${id} not found for user ${userId}`)
      throw new NotFoundException(`Notification with ID ${id} not found`)
    }

    console.log(`NotificationService: Found notification, current read status: ${notification.read}`)
    notification.read = true
    const savedNotification = await this.notificationRepository.save(notification)
    console.log(`NotificationService: Notification ${id} marked as read successfully`)
    return savedNotification
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, read: false },
      { read: true }
    )
  }

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    console.log(`NotificationService: Getting unread count for user ${userId}`)
    const count = await this.notificationRepository.count({
      where: { userId, read: false },
    })
    console.log(`NotificationService: Found ${count} unread notifications for user ${userId}`)

    return { count }
  }

  async deleteNotification(id: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    })

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`)
    }

    await this.notificationRepository.remove(notification)
  }

  async deleteAllNotifications(userId: string): Promise<void> {
    await this.notificationRepository.delete({ userId })
  }
}
