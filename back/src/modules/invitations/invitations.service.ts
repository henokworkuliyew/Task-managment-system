import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProjectInvitation } from '../../entities/project-invitation.entity'
import { Project } from '../../entities/project.entity'
import { User } from '../../entities/user.entity'

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(ProjectInvitation)
    private readonly invitationRepository: Repository<ProjectInvitation>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async acceptInvitation(token: string, userId?: string) {
    const invitation = await this.invitationRepository.findOne({
      where: { token, status: 'pending' },
      relations: ['project', 'invitedBy']
    })

    if (!invitation) {
      throw new NotFoundException('Invalid or expired invitation')
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = 'expired'
      await this.invitationRepository.save(invitation)
      throw new BadRequestException('Invitation has expired')
    }

    // If user is not authenticated, return invitation details for registration
    if (!userId) {
      return {
        requiresRegistration: true,
        invitation: {
          id: invitation.id,
          email: invitation.email,
          projectName: invitation.project.name,
          projectDescription: invitation.project.description,
          inviterName: invitation.invitedBy.name,
          token
        }
      }
    }

    // Get user and verify email matches
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (user.email !== invitation.email) {
      throw new BadRequestException('Invitation email does not match your account email')
    }

    // Check if user is already a member
    const project = await this.projectRepository.findOne({
      where: { id: invitation.projectId },
      relations: ['members']
    })

    const isAlreadyMember = project.members.some(member => member.id === userId)
    if (isAlreadyMember) {
      throw new ConflictException('You are already a member of this project')
    }

    // Add user to project members
    await this.projectRepository
      .createQueryBuilder()
      .relation(Project, 'members')
      .of(invitation.projectId)
      .add(userId)

    // Update invitation status
    invitation.status = 'accepted'
    invitation.acceptedBy = user
    await this.invitationRepository.save(invitation)

    return {
      success: true,
      message: 'Successfully joined the project',
      project: {
        id: project.id,
        name: project.name,
        description: project.description
      }
    }
  }

  async declineInvitation(token: string) {
    const invitation = await this.invitationRepository.findOne({
      where: { token, status: 'pending' }
    })

    if (!invitation) {
      throw new NotFoundException('Invalid or expired invitation')
    }

    invitation.status = 'declined'
    await this.invitationRepository.save(invitation)

    return {
      success: true,
      message: 'Invitation declined successfully'
    }
  }

  async verifyInvitation(token: string) {
    const invitation = await this.invitationRepository.findOne({
      where: { token },
      relations: ['project', 'invitedBy']
    })

    if (!invitation) {
      throw new NotFoundException('Invitation not found')
    }

    if (invitation.status !== 'pending') {
      throw new BadRequestException(`Invitation has been ${invitation.status}`)
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = 'expired'
      await this.invitationRepository.save(invitation)
      throw new BadRequestException('Invitation has expired')
    }

    return {
      email: invitation.email,
      projectName: invitation.project.name,
      projectDescription: invitation.project.description,
      inviterName: invitation.invitedBy.name,
      expiresAt: invitation.expiresAt
    }
  }

  async getUserInvitations(email: string) {
    const invitations = await this.invitationRepository.find({
      where: { email, status: 'pending' },
      relations: ['project', 'invitedBy'],
      order: { createdAt: 'DESC' }
    })

    return invitations.map(invitation => ({
      id: invitation.id,
      projectName: invitation.project.name,
      projectDescription: invitation.project.description,
      inviterName: invitation.invitedBy.name,
      createdAt: invitation.createdAt,
      expiresAt: invitation.expiresAt
    }))
  }

  async acceptInvitationById(invitationId: string, userId: string) {
    const invitation = await this.invitationRepository.findOne({
      where: { id: invitationId, status: 'pending' },
      relations: ['project']
    })

    if (!invitation) {
      throw new NotFoundException('Invitation not found')
    }

    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (user.email !== invitation.email) {
      throw new BadRequestException('This invitation is not for your email address')
    }

    return this.acceptInvitation(invitation.token, userId)
  }
}
