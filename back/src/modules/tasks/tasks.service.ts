import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { Task } from '../../entities/task.entity' // Changed from type import to regular import for decorator usage
import { User } from '../../entities/user.entity'
import { Project } from '../../entities/project.entity'
import type { CreateTaskDto } from './dto/create-task.dto'
import type { UpdateTaskDto } from './dto/update-task.dto'
import { EmailService } from '../auth/email.service'
import { NotificationsService } from '../notifications/notifications.service'
import { NotificationType } from '../../common/enums'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly emailService: EmailService,
    private readonly notificationsService: NotificationsService
  ) {}

  async create(createTaskDto: CreateTaskDto, creatorId: string): Promise<Task> {
    // First verify the creator has access to the project
    const project = await this.validateProjectAccess(createTaskDto.projectId, creatorId)
    
    // Only project owner can assign tasks
    if (createTaskDto.assigneeId) {
      if (project.owner.id !== creatorId) {
        throw new ForbiddenException('Only project owners can assign tasks')
      }
      // Validate the assignee is a project member
      await this.validateAssigneeAccess(createTaskDto.assigneeId, project)
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      attachments: createTaskDto.attachments || [],
      progress: this.calculateProgressFromStatus(createTaskDto.status || 'todo'),
      assignee: createTaskDto.assigneeId
        ? { id: createTaskDto.assigneeId }
        : null,
      project: { id: createTaskDto.projectId },
    })

    const savedTask = await this.taskRepository.save(task)

    // Send notifications if task is assigned to someone
    if (createTaskDto.assigneeId && createTaskDto.assigneeId !== creatorId) {
      await this.sendTaskAssignmentNotifications(savedTask, creatorId, 'assigned')
    }

    return savedTask
  }

  async findAll(query: any, userId: string) {
    const { page = 1, limit = 10, status, projectId, assigneeId, search } = query
    const skip = (page - 1) * limit

    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('project.members', 'members')
      .leftJoinAndSelect('task.subtasks', 'subtasks')
      .where('(project.ownerId = :userId OR members.id = :userId)', {
        userId,
      })

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status })
    }

    if (projectId) {
      queryBuilder.andWhere('task.projectId = :projectId', { projectId })
    }

    if (assigneeId) {
      queryBuilder.andWhere('task.assigneeId = :assigneeId', { assigneeId })
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search) OR LOWER(project.name) LIKE LOWER(:search))',
        { search: `%${search}%` }
      )
    }

    const [tasks, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('task.createdAt', 'DESC')
      .getManyAndCount()

    return {
      data: tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignee', 'project', 'project.members', 'project.owner', 'subtasks', 'dependencies'],
    })

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`)
    }

    // Check if user has access to this task (must be project member or owner)
    const hasAccess = 
      task.project.owner.id === userId ||
      task.project.members?.some((member) => member.id === userId)

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this task')
    }

    return task
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string
  ): Promise<Task> {
    const task = await this.findOne(id, userId)
    const oldAssigneeId = task.assignee?.id

    // Only project owner can assign tasks
    if (updateTaskDto.assigneeId && updateTaskDto.assigneeId !== oldAssigneeId) {
      if (task.project.owner.id !== userId) {
        throw new ForbiddenException('Only project owners can assign tasks')
      }
      // Validate the assignee is a project member
      await this.validateAssigneeAccess(updateTaskDto.assigneeId, task.project)
    }

    if (updateTaskDto.attachments) {
      task.attachments = updateTaskDto.attachments
    }

    Object.assign(task, updateTaskDto)
    
    if (updateTaskDto.status) {
      task.progress = this.calculateProgressFromStatus(updateTaskDto.status)
    }
    
    const updatedTask = await this.taskRepository.save(task)

    // Send notifications for assignment changes
    if (updateTaskDto.assigneeId && updateTaskDto.assigneeId !== oldAssigneeId && updateTaskDto.assigneeId !== userId) {
      await this.sendTaskAssignmentNotifications(updatedTask, userId, 'assigned')
    }

    // Send notifications for status updates
    if (updateTaskDto.status && updateTaskDto.status !== task.status) {
      await this.sendTaskUpdateNotifications(updatedTask, userId, 'status_updated')
    }

    return updatedTask
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId)
    await this.taskRepository.softDelete(id)
  }

  async addSubtask(
    parentId: string,
    createTaskDto: CreateTaskDto,
    userId: string
  ): Promise<Task> {
    const parentTask = await this.findOne(parentId, userId)

    const subtask = await this.create(createTaskDto, userId)
    subtask.parentTask = parentTask
    subtask.parentTaskId = parentTask.id

    return this.taskRepository.save(subtask)
  }

  private async sendTaskAssignmentNotifications(task: Task, assignerId: string, action: string): Promise<void> {
    try {
      // Get assignee and assigner details
      const assignee = await this.userRepository.findOne({ 
        where: { id: task.assignee.id },
        relations: ['notifications']
      })
      const assigner = await this.userRepository.findOne({ where: { id: assignerId } })

      if (!assignee || !assigner) return

      // Create in-app notification
      await this.notificationsService.create(
        assignee.id,
        `You have been assigned to task "${task.title}" by ${assigner.name}`,
        NotificationType.TASK_ASSIGNED
      )

      // Send email notification
      await this.emailService.add('task-assignment', {
        email: assignee.email,
        assigneeName: assignee.name,
        taskTitle: task.title,
        taskDescription: task.description,
        taskId: task.id,
        assignerName: assigner.name,
        dueDate: task.deadline,
        priority: task.priority
      })
    } catch (error) {
      console.error(`Failed to send task assignment notifications:`, error)
    }
  }

  private async sendTaskUpdateNotifications(task: Task, updaterId: string, updateType: string): Promise<void> {
    try {
      // Get task assignee and updater details
      const assignee = await this.userRepository.findOne({ 
        where: { id: task.assignee?.id },
        relations: ['notifications']
      })
      const updater = await this.userRepository.findOne({ where: { id: updaterId } })

      if (!assignee || !updater || assignee.id === updater.id) return

      // Create in-app notification
      await this.notificationsService.create(
        assignee.id,
        `Task "${task.title}" has been updated by ${updater.name}. Status: ${task.status}`,
        NotificationType.TASK_UPDATED
      )

      // Send email notification for important status changes
      if (task.status === 'done' || task.status === 'blocked') {
        await this.emailService.add('task-update', {
          email: assignee.email,
          assigneeName: assignee.name,
          taskTitle: task.title,
          taskId: task.id,
          updaterName: updater.name,
          newStatus: task.status,
          updateType
        })
      }
    } catch (error) {
      console.error(`Failed to send task update notifications:`, error)
    }
  }

  // Validation helper methods
  private async validateProjectAccess(projectId: string, userId: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['owner', 'members'],
    })

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`)
    }

    const hasAccess = 
      project.owner.id === userId ||
      project.members?.some((member) => member.id === userId)

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this project')
    }

    return project
  }

  private async validateAssigneeAccess(assigneeId: string, project: Project): Promise<void> {
    // Check if assignee is the project owner
    if (project.owner.id === assigneeId) {
      return
    }

    // Check if assignee is a project member
    const isProjectMember = project.members?.some((member) => member.id === assigneeId)
    
    if (!isProjectMember) {
      throw new ForbiddenException('Tasks can only be assigned to project members')
    }
  }

  private calculateProgressFromStatus(status: string): number {
    switch (status) {
      case 'todo':
        return 0
      case 'in_progress':
        return 50
      case 'blocked':
        return 25
      case 'review':
        return 80
      case 'done':
        return 100
      default:
        return 0
    }
  }
}
