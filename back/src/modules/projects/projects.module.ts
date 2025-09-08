import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProjectsController } from "./projects.controller"
import { ProjectsService } from "./projects.service"
import { Project } from "../../entities/project.entity"
import { User } from "../../entities/user.entity"
import { ProjectInvitation } from "../../entities/project-invitation.entity"
import { NotificationLog } from "../../entities/notification-log.entity"
import { EmailService } from "../auth/email.service"
import { NotificationsService } from "../notifications/notifications.service"

@Module({
  imports: [TypeOrmModule.forFeature([Project, User, ProjectInvitation, NotificationLog])],
  controllers: [ProjectsController],
  providers: [ProjectsService, EmailService, NotificationsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
