import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, In } from 'typeorm'
import {
  CalendarEvent,
  EventType,
  EventPriority,
  EventVisibility,
} from '../../entities/calendar-event.entity'
import { User } from '../../entities/user.entity'
import { Project } from '../../entities/project.entity'
import { Task } from '../../entities/task.entity'

export interface CreateEventDto {
  title: string
  description?: string
  startDate: Date
  endDate?: Date
  allDay?: boolean
  type?: EventType
  priority?: EventPriority
  visibility?: EventVisibility
  location?: string
  attendees?: string[]
  reminders?: { minutes: number; type: 'email' | 'notification' }[]
  projectId?: string
  taskId?: string
  isRecurring?: boolean
  recurrenceRule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: Date
    count?: number
  }
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}

export interface EventFilters {
  startDate?: Date
  endDate?: Date
  type?: EventType[]
  priority?: EventPriority[]
  visibility?: EventVisibility[]
  projectId?: string
  taskId?: string
  createdById?: string
}

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private eventRepository: Repository<CalendarEvent>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) {}

  async createEvent(
    createEventDto: CreateEventDto,
    userId: string
  ): Promise<CalendarEvent> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Validate dates
    this.validateEventDates(createEventDto)

    // Validate project access if projectId is provided
    if (createEventDto.projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: createEventDto.projectId },
        relations: ['members', 'owner'],
      })

      if (!project) {
        throw new NotFoundException('Project not found')
      }

      const hasAccess =
        project.owner.id === userId ||
        project.members.some((member) => member.id === userId)

      if (!hasAccess) {
        throw new ForbiddenException('You do not have access to this project')
      }
    }

    // Validate task access if taskId is provided
    if (createEventDto.taskId) {
      const task = await this.taskRepository.findOne({
        where: { id: createEventDto.taskId },
        relations: ['project', 'project.members', 'project.owner', 'assignee'],
      })

      if (!task) {
        throw new NotFoundException('Task not found')
      }

      const hasAccess =
        task.assignee?.id === userId ||
        task.project?.owner.id === userId ||
        task.project?.members.some((member) => member.id === userId)

      if (!hasAccess) {
        throw new ForbiddenException('You do not have access to this task')
      }
    }

    const event = this.eventRepository.create({
      ...createEventDto,
      createdById: userId,
      projectId: createEventDto.projectId || null,
      taskId: createEventDto.taskId || null,
    })

    return await this.eventRepository.save(event)
  }

  async getEvents(
    filters: EventFilters,
    userId: string
  ): Promise<CalendarEvent[]> {
    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.createdBy', 'creator')
      .leftJoinAndSelect('event.project', 'project')
      .leftJoinAndSelect('project.members', 'projectMembers')
      .leftJoinAndSelect('project.owner', 'projectOwner')
      .leftJoinAndSelect('event.task', 'task')
      .leftJoinAndSelect('task.assignee', 'taskAssignee')
      .where('event.isActive = :isActive', { isActive: true })

    // Authorization: Only show events user has access to
    queryBuilder.andWhere(
      `(
      event.createdById = :userId OR
      (event.visibility = :publicVisibility) OR
      (event.visibility = :projectVisibility AND (
        projectOwner.id = :userId OR
        projectMembers.id = :userId
      )) OR
      (event.taskId IS NOT NULL AND taskAssignee.id = :userId)
    )`,
      {
        userId,
        publicVisibility: EventVisibility.PUBLIC,
        projectVisibility: EventVisibility.PROJECT_MEMBERS,
      }
    )

    // Apply filters
    if (filters.startDate && filters.endDate) {
      queryBuilder.andWhere('event.startDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      })
    }

    if (filters.type && filters.type.length > 0) {
      queryBuilder.andWhere('event.type IN (:...types)', {
        types: filters.type,
      })
    }

    if (filters.priority && filters.priority.length > 0) {
      queryBuilder.andWhere('event.priority IN (:...priorities)', {
        priorities: filters.priority,
      })
    }

    if (filters.visibility && filters.visibility.length > 0) {
      queryBuilder.andWhere('event.visibility IN (:...visibilities)', {
        visibilities: filters.visibility,
      })
    }

    if (filters.projectId) {
      queryBuilder.andWhere('event.projectId = :projectId', {
        projectId: filters.projectId,
      })
    }

    if (filters.taskId) {
      queryBuilder.andWhere('event.taskId = :taskId', {
        taskId: filters.taskId,
      })
    }

    if (filters.createdById) {
      queryBuilder.andWhere('event.createdById = :createdById', {
        createdById: filters.createdById,
      })
    }

    queryBuilder.orderBy('event.startDate', 'ASC')

    return await queryBuilder.getMany()
  }

  async getEventById(eventId: string, userId: string): Promise<CalendarEvent> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId, isActive: true },
      relations: [
        'createdBy',
        'project',
        'project.members',
        'project.owner',
        'task',
        'task.assignee',
      ],
    })

    if (!event) {
      throw new NotFoundException('Event not found')
    }

    // Check authorization
    const hasAccess =
      event.createdById === userId ||
      event.visibility === EventVisibility.PUBLIC ||
      (event.visibility === EventVisibility.PROJECT_MEMBERS &&
        event.project &&
        (event.project.owner.id === userId ||
          event.project.members.some((member) => member.id === userId))) ||
      (event.task && event.task.assignee?.id === userId)

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this event')
    }

    return event
  }

  async updateEvent(
    eventId: string,
    updateEventDto: UpdateEventDto,
    userId: string
  ): Promise<CalendarEvent> {
    const event = await this.getEventById(eventId, userId)

    // Only creator can update the event
    if (event.createdById !== userId) {
      throw new ForbiddenException(
        'Only the event creator can update this event'
      )
    }

    // Validate dates if they are being updated
    if (updateEventDto.startDate || updateEventDto.endDate) {
      const eventToValidate = {
        ...event,
        ...updateEventDto,
      }
      this.validateEventDates(eventToValidate)
    }

    // Validate project access if projectId is being updated
    if (
      updateEventDto.projectId &&
      updateEventDto.projectId !== event.projectId
    ) {
      const project = await this.projectRepository.findOne({
        where: { id: updateEventDto.projectId },
        relations: ['members', 'owner'],
      })

      if (!project) {
        throw new NotFoundException('Project not found')
      }

      const hasAccess =
        project.owner.id === userId ||
        project.members.some((member) => member.id === userId)

      if (!hasAccess) {
        throw new ForbiddenException('You do not have access to this project')
      }
    }

    // Validate task access if taskId is being updated
    if (updateEventDto.taskId && updateEventDto.taskId !== event.taskId) {
      const task = await this.taskRepository.findOne({
        where: { id: updateEventDto.taskId },
        relations: ['project', 'project.members', 'project.owner', 'assignee'],
      })

      if (!task) {
        throw new NotFoundException('Task not found')
      }

      const hasAccess =
        task.assignee?.id === userId ||
        task.project?.owner.id === userId ||
        task.project?.members.some((member) => member.id === userId)

      if (!hasAccess) {
        throw new ForbiddenException('You do not have access to this task')
      }
    }

    Object.assign(event, updateEventDto)
    return await this.eventRepository.save(event)
  }

  async deleteEvent(eventId: string, userId: string): Promise<void> {
    const event = await this.getEventById(eventId, userId)

    // Only creator can delete the event
    if (event.createdById !== userId) {
      throw new ForbiddenException(
        'Only the event creator can delete this event'
      )
    }

    // Soft delete
    event.isActive = false
    await this.eventRepository.save(event)
  }

  async getUpcomingEvents(
    userId: string,
    days: number = 7
  ): Promise<CalendarEvent[]> {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    return this.getEvents({ startDate, endDate }, userId)
  }

  async getEventsByProject(
    projectId: string,
    userId: string
  ): Promise<CalendarEvent[]> {
    return this.getEvents({ projectId }, userId)
  }

  async getEventsByTask(
    taskId: string,
    userId: string
  ): Promise<CalendarEvent[]> {
    return this.getEvents({ taskId }, userId)
  }

  private validateEventDates(eventData: {
    startDate: Date
    endDate?: Date
    allDay?: boolean
  }): void {
    const { startDate, endDate, allDay } = eventData

    // Validate start date is not in the past (allow same day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventStartDate = new Date(startDate)
    eventStartDate.setHours(0, 0, 0, 0)

    if (eventStartDate < today) {
      throw new BadRequestException('Event start date cannot be in the past')
    }

    // If end date is provided, validate it's after start date
    if (endDate) {
      const eventEndDate = new Date(endDate)
      const eventStartDateTime = new Date(startDate)

      if (eventEndDate <= eventStartDateTime) {
        throw new BadRequestException('Event end date must be after start date')
      }

      // For all-day events, end date should be at least the next day
      if (allDay) {
        const nextDay = new Date(eventStartDateTime)
        nextDay.setDate(nextDay.getDate() + 1)
        nextDay.setHours(0, 0, 0, 0)

        const endDateOnly = new Date(eventEndDate)
        endDateOnly.setHours(0, 0, 0, 0)

        if (endDateOnly < nextDay) {
          throw new BadRequestException(
            'All-day events must have end date at least one day after start date'
          )
        }
      }
    } else if (!allDay) {
      // For non-all-day events without end date, set a default duration of 1 hour
      // This is handled in the entity creation, but we validate that it makes sense
      const eventStartDateTime = new Date(startDate)
      const currentTime = new Date()

      if (eventStartDateTime < currentTime) {
        throw new BadRequestException('Event start time cannot be in the past')
      }
    }
  }
}
