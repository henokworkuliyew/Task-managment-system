import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common'
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard'
import { CalendarService, CreateEventDto, UpdateEventDto, EventFilters } from './calendar.service'
import { CalendarEvent, EventType, EventPriority, EventVisibility } from '../entities/calendar-event.entity'

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('events')
  async createEvent(
    @Body(ValidationPipe) createEventDto: CreateEventDto,
    @Request() req: any,
  ): Promise<CalendarEvent> {
    return this.calendarService.createEvent(createEventDto, req.user.id)
  }

  @Get('events')
  async getEvents(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: string,
    @Query('priority') priority?: string,
    @Query('visibility') visibility?: string,
    @Query('projectId') projectId?: string,
    @Query('taskId') taskId?: string,
    @Query('createdById') createdById?: string,
  ): Promise<CalendarEvent[]> {
    const filters: EventFilters = {}

    if (startDate) filters.startDate = new Date(startDate)
    if (endDate) filters.endDate = new Date(endDate)
    if (type) filters.type = type.split(',') as EventType[]
    if (priority) filters.priority = priority.split(',') as EventPriority[]
    if (visibility) filters.visibility = visibility.split(',') as EventVisibility[]
    if (projectId) filters.projectId = projectId
    if (taskId) filters.taskId = taskId
    if (createdById) filters.createdById = createdById

    return this.calendarService.getEvents(filters, req.user.id)
  }

  @Get('events/upcoming')
  async getUpcomingEvents(
    @Request() req: any,
    @Query('days') days?: string,
  ): Promise<CalendarEvent[]> {
    const daysNumber = days ? parseInt(days, 10) : 7
    return this.calendarService.getUpcomingEvents(req.user.id, daysNumber)
  }

  @Get('events/:id')
  async getEventById(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<CalendarEvent> {
    return this.calendarService.getEventById(id, req.user.id)
  }

  @Put('events/:id')
  async updateEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateEventDto: UpdateEventDto,
    @Request() req: any,
  ): Promise<CalendarEvent> {
    return this.calendarService.updateEvent(id, updateEventDto, req.user.id)
  }

  @Delete('events/:id')
  async deleteEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    await this.calendarService.deleteEvent(id, req.user.id)
    return { message: 'Event deleted successfully' }
  }

  @Get('projects/:projectId/events')
  async getEventsByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Request() req: any,
  ): Promise<CalendarEvent[]> {
    return this.calendarService.getEventsByProject(projectId, req.user.id)
  }

  @Get('tasks/:taskId/events')
  async getEventsByTask(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Request() req: any,
  ): Promise<CalendarEvent[]> {
    return this.calendarService.getEventsByTask(taskId, req.user.id)
  }
}
