import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { PendingRegistration } from '../entities/pending-registration.entity'
import { Project } from '../entities/project.entity'
import { ProjectInvitation } from '../entities/project-invitation.entity'
import { Task } from '../entities/task.entity'
import { Issue } from '../entities/issue.entity'
import { Comment } from '../entities/comment.entity'
import { NotificationLog } from '../entities/notification-log.entity'
import { TimeLog } from '../entities/time-log.entity'
import { AuditLog } from '../entities/audit-log.entity'
import { Webhook } from '../entities/webhook.entity'
import { CalendarEvent } from '../entities/calendar-event.entity'
import { Message } from '../entities/message.entity'

export const databaseConfig = (
  configService: ConfigService
): TypeOrmModuleOptions => {
  // Check if we're in development mode
  const nodeEnv = configService.get<string>('NODE_ENV');
  const isDevMode = nodeEnv === 'development';
  
  // Check if we have a direct URL for database connection (for migrations)
  const directUrl = configService.get<string>('DIRECT_URL');
  
  // Check if we have a pooled URL for connection pooling
  const databaseUrl = configService.get<string>('DATABASE_URL');
  
  // Common configuration
  const commonConfig = {
    entities: [
      User,
      Project,
      ProjectInvitation,
      Task,
      Issue,
      Comment,
      NotificationLog,
      TimeLog,
      AuditLog,
      Webhook,
      CalendarEvent,
      Message,
    ],
    synchronize: isDevMode,
    logging: ['error', 'schema', 'migration'] as any,
    logger: 'advanced-console',
    // Add connection retry options
    retryAttempts: isDevMode ? 1 : 5,
    retryDelay: 3000,
    keepConnectionAlive: true,
  };
  
  // If we have a direct URL, use it directly
  if (directUrl) {
    return {
      type: 'postgres',
      url: directUrl,
      ...commonConfig,
    } as TypeOrmModuleOptions;
  }
  
  // If we have a database URL with connection pooling, use it
  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      ...commonConfig,
      ssl: {
        rejectUnauthorized: false,
      },
    } as TypeOrmModuleOptions;
  }
  
  // If we're in development mode and no database connection is available,
  // Always use PostgreSQL for consistency across environments
  if (isDevMode) {
    console.log('Using PostgreSQL database for development');
  }// Fallback to traditional connection parameters
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', ''),
    database: configService.get<string>('DB_DATABASE', 'task_manager'),
    ...commonConfig,
  } as TypeOrmModuleOptions;
}
