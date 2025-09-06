import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { Task } from '../../entities/task.entity' // Changed from type import to regular import for decorator usage
import type { CreateTaskDto } from './dto/create-task.dto'
import type { UpdateTaskDto } from './dto/update-task.dto'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>
  ) {}

  async create(createTaskDto: CreateTaskDto, creatorId: string): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      attachments: createTaskDto.attachments || [],
      assignee: createTaskDto.assigneeId
        ? { id: createTaskDto.assigneeId }
        : null,
      project: { id: createTaskDto.projectId },
    })

    return this.taskRepository.save(task)
  }

  async findAll(query: any, userId: string) {
    const { page = 1, limit = 10, status, projectId, assigneeId } = query
    const skip = (page - 1) * limit

    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.subtasks', 'subtasks')
      .where('(task.assigneeId = :userId OR project.ownerId = :userId)', {
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
      relations: ['assignee', 'project', 'subtasks', 'dependencies'],
    })

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`)
    }

    return task
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string
  ): Promise<Task> {
    const task = await this.findOne(id, userId)

    if (updateTaskDto.attachments) {
      task.attachments = updateTaskDto.attachments
    }

    Object.assign(task, updateTaskDto)
    return this.taskRepository.save(task)
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
}
