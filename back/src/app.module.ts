import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ThrottlerModule } from "@nestjs/throttler"
import { BullModule } from "@nestjs/bull"

// Modules
import { AuthModule } from "./modules/auth/auth.module"
import { UsersModule } from "./modules/users/users.module"
import { ProjectsModule } from "./modules/projects/projects.module"
import { TasksModule } from "./modules/tasks/tasks.module"
import { IssuesModule } from "./modules/issues/issues.module"
import { CommentsModule } from "./modules/comments/comments.module"
import { NotificationsModule } from "./modules/notifications/notifications.module"
import { TimeTrackingModule } from "./modules/time-tracking/time-tracking.module"
import { ReportsModule } from "./modules/reports/reports.module"
import { WebhooksModule } from "./modules/webhooks/webhooks.module"

// Configuration
import { databaseConfig } from "./config/database.config"
import { cloudinaryConfig } from "./config/cloudinary.config"

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute
      },
    ]),

    // Bull Queue (for background jobs)
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get("REDIS_HOST") || "localhost",
          port: configService.get("REDIS_PORT") || 6379,
        },
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
    IssuesModule,
    CommentsModule,
    NotificationsModule,
    TimeTrackingModule,
    ReportsModule,
    WebhooksModule,
  ],
  providers: [
    {
      provide: "CLOUDINARY_CONFIG",
      useFactory: cloudinaryConfig,
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
