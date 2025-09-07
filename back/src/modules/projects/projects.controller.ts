import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Query, Request, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { ProjectsService } from "./projects.service"
import { CreateProjectDto } from "./dto/create-project.dto"
import { UpdateProjectDto } from "./dto/update-project.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { PaginationDto } from "../../common/dtos/pagination.dto"

@ApiTags("projects")
@Controller("projects")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new project" })
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user.id)
  }

  @Get()
  @ApiOperation({ summary: "Get all projects" })
  findAll(@Query() paginationDto: PaginationDto, @Request() req) {
    console.log('Projects Controller - Headers:', req.headers.authorization ? 'AUTH_HEADER_PRESENT' : 'AUTH_HEADER_MISSING')
    return this.projectsService.findAll(paginationDto, req.user.id)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get project by ID" })
  findOne(@Param('id') id: string, @Request() req) {
    return this.projectsService.findOne(id, req.user.id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update project by ID" })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Request() req) {
    return this.projectsService.update(id, updateProjectDto, req.user.id)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete project" })
  remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(id, req.user.id)
  }
}
