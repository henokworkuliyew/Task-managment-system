import type { ConfigService } from '@nestjs/config'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { Project } from '../entities/project.entity'
import { Task } from '../entities/task.entity'
import { Issue } from '../entities/issue.entity'
import { Comment } from '../entities/comment.entity'
import { NotificationLog } from '../entities/notification-log.entity'
import { TimeLog } from '../entities/time-log.entity'
import { AuditLog } from '../entities/audit-log.entity'
import { Webhook } from '../entities/webhook.entity'

export const databaseConfig = (
  configService: ConfigService
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [
    User,
    Project,
    Task,
    Issue,
    Comment,
    NotificationLog,
    TimeLog,
    AuditLog,
    Webhook,
  ],
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
  ssl:
    configService.get('NODE_ENV') === 'production'
      ? { rejectUnauthorized: false }
      : false,
})
