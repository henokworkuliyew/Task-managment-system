import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TasksService } from './tasks.service'
import { TasksController } from './tasks.controller'
import { Task } from '../../entities/task.entity'
import { User } from '../../entities/user.entity'
import { Project } from '../../entities/project.entity'
import { NotificationLog } from '../../entities/notification-log.entity'
import { EmailService } from '../auth/email.service'
import { NotificationsService } from '../notifications/notifications.service'

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Project, NotificationLog])],
  controllers: [TasksController],
  providers: [TasksService, EmailService, NotificationsService],
  exports: [TasksService],
})
export class TasksModule {}
