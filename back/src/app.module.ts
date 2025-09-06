import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ThrottlerModule } from "@nestjs/throttler"
import { BullModule } from "@nestjs/bull"

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


import { databaseConfig } from "./config/database.config"
import { cloudinaryConfig } from "./config/cloudinary.config"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

   
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),

   
    ThrottlerModule.forRoot([
      {
        ttl: 120000,
        limit: 40,
      },
    ]),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get("REDIS_URL");
        if (redisUrl) {
          return {
            redis: redisUrl,
          };
        }
        return {
          redis: {
            host: configService.get("REDIS_HOST") || "localhost",
            port: configService.get("REDIS_PORT") || 6379,
            maxRetriesPerRequest: null, 
            connectTimeout: 10000, 
            retryStrategy: (times) => {
              const delay = Math.min(times * 50, 2000);
              return delay;
            },
          },
        };
      },
      inject: [ConfigService],
    }),

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
