import { Injectable } from '@nestjs/common'
import type { Repository } from 'typeorm'
import type { Response } from 'express'
import type { Task } from '../../entities/task.entity' // Changed from type import to regular import for decorator usage
import type { Project } from '../../entities/project.entity' // Changed from type import to regular import for decorator usage
import type { TimeLog } from '../../entities/time-log.entity' // Changed from type import to regular import for decorator usage
import { TaskStatus } from '../../common/enums'

@Injectable()
export class ReportsService {
  private readonly taskRepository: Repository<Task>
  private readonly projectRepository: Repository<Project>
  private readonly timeLogRepository: Repository<TimeLog>

  constructor(
    taskRepository: Repository<Task>,
    projectRepository: Repository<Project>,
    timeLogRepository: Repository<TimeLog>
  ) {
    this.taskRepository = taskRepository
    this.projectRepository = projectRepository
    this.timeLogRepository = timeLogRepository
  }

  async getBurndownChart(projectId: string, userId: string) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['tasks'],
    })

    if (!project) {
      throw new Error('Project not found')
    }

    const tasks = await this.taskRepository.find({
      where: { project: { id: projectId } },
      order: { createdAt: 'ASC' },
    })

    const totalTasks = tasks.length
    const completedTasks = tasks.filter(
      (task) => task.status === TaskStatus.DONE
    ).length
    const remainingTasks = totalTasks - completedTasks

    return {
      projectId,
      totalTasks,
      completedTasks,
      remainingTasks,
      completionPercentage:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      tasks: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        status: task.status,
        progress: task.progress,
        createdAt: task.createdAt,
      })),
    }
  }

  async getVelocityReport(query: any, userId: string) {
    const { projectId, startDate, endDate } = query

    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .where('task.status = :status', { status: TaskStatus.DONE })

    if (projectId) {
      queryBuilder.andWhere('task.projectId = :projectId', { projectId })
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('task.updatedAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
    }

    const completedTasks = await queryBuilder.getMany()

    return {
      totalCompleted: completedTasks.length,
      averageCompletionTime:
        this.calculateAverageCompletionTime(completedTasks),
      tasksPerWeek: this.calculateTasksPerWeek(completedTasks),
      completedTasks,
    }
  }

  async getOverdueTasks(query: any, userId: string) {
    const { projectId } = query
    const now = new Date()

    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.project', 'project')
      .where('task.deadline < :now AND task.status != :doneStatus', {
        now,
        doneStatus: TaskStatus.DONE,
      })

    if (projectId) {
      queryBuilder.andWhere('task.projectId = :projectId', { projectId })
    }

    const overdueTasks = await queryBuilder.getMany()

    return {
      totalOverdue: overdueTasks.length,
      overdueTasks,
    }
  }

  async exportToCsv(query: any, userId: string, res: Response) {
    const { type = 'tasks', projectId } = query

    let data: any[] = []
    let filename = ''

    if (type === 'tasks') {
      const queryBuilder = this.taskRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.assignee', 'assignee')
        .leftJoinAndSelect('task.project', 'project')

      if (projectId) {
        queryBuilder.where('task.projectId = :projectId', { projectId })
      }

      data = await queryBuilder.getMany()
      filename = 'tasks-export.csv'
    }

    const csv = this.convertToCSV(data)

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
    res.send(csv)
  }

  private calculateAverageCompletionTime(tasks: Task[]): number {
    if (tasks.length === 0) return 0

    const totalTime = tasks.reduce((sum, task) => {
      const createdAt = new Date(task.createdAt).getTime()
      const updatedAt = new Date(task.updatedAt).getTime()
      return sum + (updatedAt - createdAt)
    }, 0)

    return Math.round(totalTime / tasks.length / (1000 * 60 * 60 * 24)) // Average days
  }

  private calculateTasksPerWeek(tasks: Task[]): number {
    if (tasks.length === 0) return 0

    const weeks = Math.ceil(tasks.length / 7)
    return Math.round(tasks.length / weeks)
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return ''

    const headers = Object.keys(data[0]).join(',')
    const rows = data.map((item) =>
      Object.values(item)
        .map((value) => (typeof value === 'string' ? `"${value}"` : value))
        .join(',')
    )

    return [headers, ...rows].join('\n')
  }
}
