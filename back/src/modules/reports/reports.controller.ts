import { Controller, Get, Query, UseGuards, Request, Res } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { Response } from "express"
import { ReportsService } from "./reports.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("reports")
@Controller("reports")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("burndown")
  @ApiOperation({ summary: "Get burndown chart data for a project" })
  getBurndownChart(@Query('projectId') projectId: string, @Request() req) {
    return this.reportsService.getBurndownChart(projectId, req.user.id)
  }

  @Get("velocity")
  @ApiOperation({ summary: "Get task velocity report" })
  getVelocityReport(@Query() query: any, @Request() req) {
    return this.reportsService.getVelocityReport(query, req.user.id)
  }

  @Get("overdue")
  @ApiOperation({ summary: "Get overdue tasks report" })
  getOverdueTasks(@Query() query: any, @Request() req) {
    return this.reportsService.getOverdueTasks(query, req.user.id)
  }

  @Get("export")
  @ApiOperation({ summary: "Export reports to CSV" })
  exportToCsv(@Query() query: any, @Request() req, @Res() res: Response) {
    return this.reportsService.exportToCsv(query, req.user.id, res)
  }
}
