import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { TimeLog } from '../../entities/time-log.entity' // Changed from type import to regular import for decorator usage
import type { StartTimeLogDto } from './dto/start-time-log.dto'
import type { StopTimeLogDto } from './dto/stop-time-log.dto'

@Injectable()
export class TimeTrackingService {
  constructor(
    @InjectRepository(TimeLog)
    private readonly timeLogRepository: Repository<TimeLog>
  ) {}

  async startTimer(
    startTimeLogDto: StartTimeLogDto,
    userId: string
  ): Promise<TimeLog> {
    // Check if user has any active timer
    const activeTimer = await this.timeLogRepository.findOne({
      where: { user: { id: userId }, endTime: null },
    })

    if (activeTimer) {
      throw new BadRequestException(
        'You already have an active timer. Please stop it first.'
      )
    }

    const timeLog = this.timeLogRepository.create({
      ...startTimeLogDto,
      user: { id: userId },
      task: { id: startTimeLogDto.taskId },
      startTime: new Date(),
    })

    return this.timeLogRepository.save(timeLog)
  }

  async stopTimer(
    stopTimeLogDto: StopTimeLogDto,
    userId: string
  ): Promise<TimeLog> {
    const activeTimer = await this.timeLogRepository.findOne({
      where: { user: { id: userId }, endTime: null },
    })

    if (!activeTimer) {
      throw new BadRequestException('No active timer found.')
    }

    const endTime = new Date()
    const duration = Math.floor(
      (endTime.getTime() - activeTimer.startTime.getTime()) / 1000
    )

    activeTimer.endTime = endTime
    activeTimer.duration = duration
    if (stopTimeLogDto.description) {
      activeTimer.description = stopTimeLogDto.description
    }

    return this.timeLogRepository.save(activeTimer)
  }

  async getLogs(query: any, userId: string) {
    const {
      page = 1,
      limit = 10,
      taskId,
      projectId,
      startDate,
      endDate,
    } = query
    const skip = (page - 1) * limit

    const queryBuilder = this.timeLogRepository
      .createQueryBuilder('timeLog')
      .leftJoinAndSelect('timeLog.task', 'task')
      .leftJoinAndSelect('task.project', 'project')
      .where('timeLog.userId = :userId', { userId })

    if (taskId) {
      queryBuilder.andWhere('timeLog.taskId = :taskId', { taskId })
    }

    if (projectId) {
      queryBuilder.andWhere('task.projectId = :projectId', { projectId })
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'timeLog.startTime BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        }
      )
    }

    const [timeLogs, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('timeLog.startTime', 'DESC')
      .getManyAndCount()

    return {
      data: timeLogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getReports(query: any, userId: string) {
    const { projectId, startDate, endDate } = query

    const queryBuilder = this.timeLogRepository
      .createQueryBuilder('timeLog')
      .leftJoinAndSelect('timeLog.task', 'task')
      .leftJoinAndSelect('task.project', 'project')
      .where('timeLog.userId = :userId AND timeLog.endTime IS NOT NULL', {
        userId,
      })

    if (projectId) {
      queryBuilder.andWhere('task.projectId = :projectId', { projectId })
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'timeLog.startTime BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        }
      )
    }

    const timeLogs = await queryBuilder.getMany()

    const totalDuration = timeLogs.reduce(
      (sum, log) => sum + (log.duration || 0),
      0
    )
    const totalHours = Math.round((totalDuration / 3600) * 100) / 100

    return {
      totalDuration,
      totalHours,
      totalLogs: timeLogs.length,
      timeLogs,
    }
  }
}
