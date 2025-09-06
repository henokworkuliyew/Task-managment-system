import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Query, Request, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { IssuesService } from "./issues.service"
import { CreateIssueDto } from "./dto/create-issue.dto"
import { UpdateIssueDto } from "./dto/update-issue.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("issues")
@Controller("issues")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  @ApiOperation({ summary: "Create a new issue" })
  create(@Body() createIssueDto: CreateIssueDto, @Request() req) {
    return this.issuesService.create(createIssueDto, req.user.id)
  }

  @Get()
  @ApiOperation({ summary: "Get all issues with pagination and filters" })
  findAll(@Query() query: any, @Request() req) {
    return this.issuesService.findAll(query, req.user.id)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get issue by ID" })
  findOne(@Param('id') id: string, @Request() req) {
    return this.issuesService.findOne(id, req.user.id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update issue by ID" })
  update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto, @Request() req) {
    return this.issuesService.update(id, updateIssueDto, req.user.id)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete issue" })
  remove(@Param('id') id: string, @Request() req) {
    return this.issuesService.remove(id, req.user.id)
  }
}
