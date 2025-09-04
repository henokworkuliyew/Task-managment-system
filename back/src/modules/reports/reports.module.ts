import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ReportsController } from "./reports.controller"
import { ReportsService } from "./reports.service"
import { Task } from "../../entities/task.entity"
import { Project } from "../../entities/project.entity"
import { TimeLog } from "../../entities/time-log.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project, TimeLog])],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
