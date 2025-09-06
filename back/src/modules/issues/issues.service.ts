import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { Issue } from '../../entities/issue.entity' // Changed from type import to regular import for decorator usage
import type { CreateIssueDto } from './dto/create-issue.dto'
import type { UpdateIssueDto } from './dto/update-issue.dto'

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>
  ) {}

  async create(
    createIssueDto: CreateIssueDto,
    reporterId: string
  ): Promise<Issue> {
    const issue = this.issueRepository.create({
      ...createIssueDto,
      attachments: createIssueDto.attachments || [],
      reporter: { id: reporterId },
      assignee: createIssueDto.assigneeId
        ? { id: createIssueDto.assigneeId }
        : null,
      project: { id: createIssueDto.projectId },
    })

    return this.issueRepository.save(issue)
  }

  async findAll(query: any, userId: string) {
    const { page = 1, limit = 10, status, severity, projectId } = query
    const skip = (page - 1) * limit

    const queryBuilder = this.issueRepository
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.assignee', 'assignee')
      .leftJoinAndSelect('issue.reporter', 'reporter')
      .leftJoinAndSelect('issue.project', 'project')
      .where(
        '(issue.assigneeId = :userId OR issue.reporterId = :userId OR project.ownerId = :userId)',
        { userId }
      )

    if (status) {
      queryBuilder.andWhere('issue.status = :status', { status })
    }

    if (severity) {
      queryBuilder.andWhere('issue.severity = :severity', { severity })
    }

    if (projectId) {
      queryBuilder.andWhere('issue.projectId = :projectId', { projectId })
    }

    const [issues, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('issue.createdAt', 'DESC')
      .getManyAndCount()

    return {
      data: issues,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne(id: string, userId: string): Promise<Issue> {
    const issue = await this.issueRepository.findOne({
      where: { id },
      relations: ['assignee', 'reporter', 'project'],
    })

    if (!issue) {
      throw new NotFoundException(`Issue with ID ${id} not found`)
    }

    return issue
  }

  async update(
    id: string,
    updateIssueDto: UpdateIssueDto,
    userId: string
  ): Promise<Issue> {
    const issue = await this.findOne(id, userId)

    if (updateIssueDto.attachments) {
      issue.attachments = updateIssueDto.attachments
    }

    Object.assign(issue, updateIssueDto)
    return this.issueRepository.save(issue)
  }

  async remove(id: string, userId: string): Promise<void> {
    const issue = await this.findOne(id, userId)
    await this.issueRepository.softDelete(id)
  }
}
