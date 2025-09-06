import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Query, Request, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { TasksService } from "./tasks.service"
import { CreateTaskDto } from "./dto/create-task.dto"
import { UpdateTaskDto } from "./dto/update-task.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("tasks")
@Controller("tasks")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: "Create a new task" })
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(createTaskDto, req.user.id)
  }

  @Get()
  @ApiOperation({ summary: "Get all tasks with pagination and filters" })
  findAll(@Query() query: any, @Request() req) {
    return this.tasksService.findAll(query, req.user.id)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get task by ID" })
  findOne(@Param('id') id: string, @Request() req) {
    return this.tasksService.findOne(id, req.user.id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update task by ID" })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    return this.tasksService.update(id, updateTaskDto, req.user.id)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete task" })
  remove(@Param('id') id: string, @Request() req) {
    return this.tasksService.remove(id, req.user.id)
  }

  @Post(":id/subtasks")
  @ApiOperation({ summary: "Add subtask to a task" })
  addSubtask(@Param('id') id: string, createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.addSubtask(id, createTaskDto, req.user.id)
  }
}
