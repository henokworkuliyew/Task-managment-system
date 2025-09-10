import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Project } from '../../entities/project.entity'
import { User } from '../../entities/user.entity'
import { ProjectInvitation } from '../../entities/project-invitation.entity'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { EmailService } from '../auth/email.service'
import { NotificationsService } from '../notifications/notifications.service'
import { NotificationType } from '../../common/enums'
import { v4 as uuidv4 } from 'uuid'
import { PaginationDto } from '../../common/dtos/pagination.dto'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProjectInvitation)
    private readonly invitationRepository: Repository<ProjectInvitation>,
    private readonly emailService: EmailService,
    private readonly notificationsService: NotificationsService
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    ownerId: string
  ): Promise<Project> {
    const { memberEmails, ...projectData } = createProjectDto
    
    // Get the owner user for invitation emails
    const owner = await this.userRepository.findOne({ where: { id: ownerId } })
    if (!owner) {
      throw new NotFoundException('Owner not found')
    }

    // Create project with owner as initial member
    const project = this.projectRepository.create({
      ...projectData,
      owner: { id: ownerId },
      members: [{ id: ownerId }], // Automatically add owner as a member
    })

    const savedProject = await this.projectRepository.save(project)

    // Handle member invitations if provided
    if (memberEmails && memberEmails.length > 0) {
      await this.inviteMembers(savedProject, memberEmails, owner)
      
      // Reload project with all members to return complete data
      const projectWithMembers = await this.projectRepository.findOne({
        where: { id: savedProject.id },
        relations: ['owner', 'members', 'tasks', 'issues'],
      })
      
      
      return projectWithMembers || savedProject
    }

    return savedProject
  }

  private async inviteMembers(
    project: Project,
    memberEmails: string[],
    inviter: User
  ): Promise<void> {
    for (const email of memberEmails) {
      // Skip if email is the same as owner's email
      if (email === inviter.email) {
        continue
      }

      // Check if user already exists
      const existingUser = await this.userRepository.findOne({ where: { email } })
      
      if (existingUser) {
        // Add existing user as project member
        const currentProject = await this.projectRepository.findOne({
          where: { id: project.id },
          relations: ['members']
        })
        
        if (currentProject) {
          // Check if user is already a member
          const isAlreadyMember = currentProject.members.some(member => member.id === existingUser.id)
          
          if (!isAlreadyMember) {
            currentProject.members.push(existingUser)
            await this.projectRepository.save(currentProject)

            // Send email notification to the added member
            try {
              await this.emailService.add('project-member-added', {
                email: existingUser.email,
                memberName: existingUser.name,
                projectName: project.name,
                projectDescription: project.description,
                projectId: project.id,
                inviterName: inviter.name
              })
            } catch (error) {
              console.error(`Failed to send member notification email to ${existingUser.email}:`, error)
            }

            // Create in-app notification
            try {
              await this.notificationsService.create(
                existingUser.id,
                `You have been added to project "${project.name}" by ${inviter.name}`,
                NotificationType.PROJECT_MEMBER_ADDED
              )
            } catch (error) {
              console.error(`Failed to create in-app notification for user ${existingUser.id}:`, error)
            }
          }
        }
      } else {
        // Create invitation for non-registered user
        const invitationToken = uuidv4()
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

        const invitation = this.invitationRepository.create({
          email,
          token: invitationToken,
          expiresAt,
          project: { id: project.id },
          invitedBy: { id: inviter.id },
          status: 'pending'
        })

        await this.invitationRepository.save(invitation)

        // Send invitation email
        try {
          await this.emailService.add('project-invitation', {
            email,
            projectName: project.name,
            projectDescription: project.description,
            inviterName: inviter.name,
            invitationToken
          })
        } catch (error) {
          console.error(`Failed to send invitation email to ${email}:`, error)
        }
      }
    }
  }

  async findAll(paginationDto: PaginationDto & { search?: string }, userId: string) {
    const { page = 1, limit = 10, search } = paginationDto
    const skip = (page - 1) * limit

    console.log('ProjectsService.findAll - User ID:', userId)
    
    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.members', 'members')
      .leftJoinAndSelect('project.tasks', 'tasks')
      .where('project.ownerId = :userId OR members.id = :userId', { userId })

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(project.name) LIKE LOWER(:search) OR LOWER(project.description) LIKE LOWER(:search))',
        { search: `%${search}%` }
      )
    }

    const [projects, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('project.createdAt', 'DESC')
      .getManyAndCount()

    const projectsWithProgress = projects.map(project => {
      const completedTasks = project.tasks?.filter(task => task.status === 'done').length || 0
      const totalTasks = project.tasks?.length || 0
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      
      return {
        ...project,
        progress
      }
    })

    console.log('ProjectsService.findAll - Found projects:', projectsWithProgress.length)
    console.log('ProjectsService.findAll - Project IDs:', projectsWithProgress.map(p => p.id))

    return {
      data: projectsWithProgress,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['owner', 'members', 'tasks', 'issues'],
    })

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`)
    }


    const hasAccess =
      project.owner.id === userId ||
      project.members?.some((member) => member.id === userId)

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this project')
    }

    return project
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string
  ): Promise<Project> {
    const project = await this.findOne(id, userId)

    if (project.owner.id !== userId) {
      throw new ForbiddenException('Only project owner can update the project')
    }

    Object.assign(project, updateProjectDto)
    return this.projectRepository.save(project)
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId)

    if (project.owner.id !== userId) {
      throw new ForbiddenException('Only project owner can delete the project')
    }

    await this.projectRepository.softDelete(id)
  }
}
