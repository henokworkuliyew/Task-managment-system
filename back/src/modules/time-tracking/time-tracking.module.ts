import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TimeTrackingController } from "./time-tracking.controller"
import { TimeTrackingService } from "./time-tracking.service"
import { TimeLog } from "../../entities/time-log.entity"

@Module({
  imports: [TypeOrmModule.forFeature([TimeLog])],
  controllers: [TimeTrackingController],
  providers: [TimeTrackingService],
  exports: [TimeTrackingService],
})
export class TimeTrackingModule {}
