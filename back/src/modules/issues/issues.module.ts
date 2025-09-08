import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IssuesService } from './issues.service'
import { IssuesController } from './issues.controller'
import { Issue } from '../../entities/issue.entity'
import { User } from '../../entities/user.entity'
import { Project } from '../../entities/project.entity'
import { NotificationLog } from '../../entities/notification-log.entity'
import { EmailService } from '../auth/email.service'
import { NotificationsService } from '../notifications/notifications.service'

@Module({
  imports: [TypeOrmModule.forFeature([Issue, User, Project, NotificationLog])],
  controllers: [IssuesController],
  providers: [IssuesService, EmailService, NotificationsService],
  exports: [IssuesService],
})
export class IssuesModule {}
