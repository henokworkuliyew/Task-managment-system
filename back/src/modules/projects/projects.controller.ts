import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Query, Request } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import type { ProjectsService } from "./projects.service"
import type { CreateProjectDto } from "./dto/create-project.dto"
import type { UpdateProjectDto } from "./dto/update-project.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { PaginationDto } from "../../common/dtos/pagination.dto"

@ApiTags("projects")
@Controller("projects")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new project" })
  create(createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user.id)
  }

  @Get()
  @ApiOperation({ summary: "Get all projects with pagination" })
  findAll(@Query() paginationDto: PaginationDto, @Request() req) {
    return this.projectsService.findAll(paginationDto, req.user.id)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get project by ID" })
  findOne(@Param('id') id: string, @Request() req) {
    return this.projectsService.findOne(id, req.user.id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update project" })
  update(@Param('id') id: string, updateProjectDto: UpdateProjectDto, @Request() req) {
    return this.projectsService.update(id, updateProjectDto, req.user.id)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete project" })
  remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(id, req.user.id)
  }
}
