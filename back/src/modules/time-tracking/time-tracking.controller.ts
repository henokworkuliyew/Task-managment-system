import { Controller, Get, Post, UseGuards, Query, Request, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { TimeTrackingService } from "./time-tracking.service"
import { StartTimeLogDto } from "./dto/start-time-log.dto"
import { StopTimeLogDto } from "./dto/stop-time-log.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("time-tracking")
@Controller("time-tracking")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TimeTrackingController {
  constructor(private readonly timeTrackingService: TimeTrackingService) {}

  @Post("start")
  @ApiOperation({ summary: "Start time tracking for a task" })
  startTimer(@Body() startTimeLogDto: StartTimeLogDto, @Request() req) {
    return this.timeTrackingService.startTimer(startTimeLogDto, req.user.id)
  }

  @Post("stop")
  @ApiOperation({ summary: "Stop time tracking" })
  stopTimer(@Body() stopTimeLogDto: StopTimeLogDto, @Request() req) {
    return this.timeTrackingService.stopTimer(stopTimeLogDto, req.user.id)
  }

  @Get("logs")
  @ApiOperation({ summary: "Get time logs with filters" })
  getLogs(@Query() query: any, @Request() req) {
    return this.timeTrackingService.getLogs(query, req.user.id)
  }

  @Get("reports")
  @ApiOperation({ summary: "Get time tracking reports" })
  getReports(@Query() query: any, @Request() req) {
    return this.timeTrackingService.getReports(query, req.user.id)
  }
}
