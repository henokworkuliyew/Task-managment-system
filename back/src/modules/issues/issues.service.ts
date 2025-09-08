import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { Issue } from '../../entities/issue.entity' // Changed from type import to regular import for decorator usage
import { User } from '../../entities/user.entity'
import { Project } from '../../entities/project.entity'
import type { CreateIssueDto } from './dto/create-issue.dto'
import type { UpdateIssueDto } from './dto/update-issue.dto'
import { EmailService } from '../auth/email.service'
import { NotificationsService } from '../notifications/notifications.service'
import { NotificationType } from '../../common/enums'

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly emailService: EmailService,
    private readonly notificationsService: NotificationsService
  ) {}

  async create(
    createIssueDto: CreateIssueDto,
    reporterId: string
  ): Promise<Issue> {
    const project = await this.validateProjectAccess(createIssueDto.projectId, reporterId)
    
    if (createIssueDto.assigneeId) {
      await this.validateAssigneeAccess(createIssueDto.assigneeId, project)
    }

    const issue = this.issueRepository.create({
      ...createIssueDto,
      attachments: createIssueDto.attachments || [],
      reporter: { id: reporterId },
      assignee: createIssueDto.assigneeId
        ? { id: createIssueDto.assigneeId }
        : null,
      project: { id: createIssueDto.projectId },
    })

    const savedIssue = await this.issueRepository.save(issue)

    if (createIssueDto.assigneeId && createIssueDto.assigneeId !== reporterId) {
      await this.sendIssueAssignmentNotifications(savedIssue, reporterId)
    }

    return savedIssue
  }

  async findAll(query: any, userId: string) {
    const { page = 1, limit = 10, status, severity, projectId } = query
    const skip = (page - 1) * limit

    const queryBuilder = this.issueRepository
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.assignee', 'assignee')
      .leftJoinAndSelect('issue.reporter', 'reporter')
      .leftJoinAndSelect('issue.project', 'project')
      .leftJoinAndSelect('project.members', 'members')
      .where('(project.ownerId = :userId OR members.id = :userId)', {
        userId,
      })

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
      relations: ['assignee', 'reporter', 'project', 'project.members', 'project.owner'],
    })

    if (!issue) {
      throw new NotFoundException(`Issue with ID ${id} not found`)
    }

    const hasAccess = 
      issue.project.owner.id === userId ||
      issue.project.members?.some((member) => member.id === userId)

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this issue')
    }

    return issue
  }

  async update(
    id: string,
    updateIssueDto: UpdateIssueDto,
    userId: string
  ): Promise<Issue> {
    const issue = await this.findOne(id, userId)
    const oldAssigneeId = issue.assignee?.id

    if (updateIssueDto.attachments) {
      issue.attachments = updateIssueDto.attachments
    }

    Object.assign(issue, updateIssueDto)
    const updatedIssue = await this.issueRepository.save(issue)

    if (updateIssueDto.assigneeId && updateIssueDto.assigneeId !== oldAssigneeId && updateIssueDto.assigneeId !== userId) {
      await this.sendIssueAssignmentNotifications(updatedIssue, userId)
    }

    return updatedIssue
  }

  async remove(id: string, userId: string): Promise<void> {
    const issue = await this.findOne(id, userId)
    await this.issueRepository.softDelete(id)
  }

  private async sendIssueAssignmentNotifications(issue: Issue, assignerId: string): Promise<void> {
    try {
      const assignee = await this.userRepository.findOne({ 
        where: { id: issue.assignee.id },
        relations: ['notifications']
      })
      const assigner = await this.userRepository.findOne({ where: { id: assignerId } })

      if (!assignee || !assigner) return

      await this.notificationsService.create(
        assignee.id,
        `You have been assigned to issue "${issue.title}" by ${assigner.name}`,
        NotificationType.TASK_ASSIGNED
      )

      await this.emailService.add('issue-assignment', {
        email: assignee.email,
        assigneeName: assignee.name,
        issueTitle: issue.title,
        issueDescription: issue.description,
        issueId: issue.id,
        assignerName: assigner.name,
        severity: issue.severity
      })
    } catch (error) {
      console.error(`Failed to send issue assignment notifications:`, error)
    }
  }

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
    if (project.owner.id === assigneeId) {
      return
    }

    const isProjectMember = project.members?.some((member) => member.id === assigneeId)
    
    if (!isProjectMember) {
      throw new ForbiddenException('Issues can only be assigned to project members')
    }
  }
}
