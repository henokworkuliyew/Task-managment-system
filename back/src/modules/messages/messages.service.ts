import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Message } from '../../entities/message.entity'
import { User } from '../../entities/user.entity'
import { Project } from '../../entities/project.entity'

export interface CreateMessageDto {
  content: string
  type?: 'text' | 'file' | 'image'
  attachments?: string[]
  projectId: string
}

export interface UpdateMessageDto {
  content?: string
  attachments?: string[]
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createMessageDto: CreateMessageDto, senderId: string): Promise<Message> {
    const project = await this.validateProjectAccess(createMessageDto.projectId, senderId)
    
    const message = this.messageRepository.create({
      ...createMessageDto,
      senderId,
      projectId: createMessageDto.projectId,
      attachments: createMessageDto.attachments || [],
    })

    const savedMessage = await this.messageRepository.save(message)
    
    // Get the full message with sender info for broadcasting
    const fullMessage = await this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender'],
    })

    return fullMessage
  }

  async findByProject(projectId: string, userId: string, page: number = 1, limit: number = 50): Promise<{
    data: Message[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    await this.validateProjectAccess(projectId, userId)
    
    const skip = (page - 1) * limit

    const [messages, total] = await this.messageRepository.findAndCount({
      where: { projectId, isActive: true },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    })

    return {
      data: messages,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async update(id: string, updateMessageDto: UpdateMessageDto, userId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id, isActive: true },
      relations: ['sender', 'project'],
    })

    if (!message) {
      throw new NotFoundException('Message not found')
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only edit your own messages')
    }

    Object.assign(message, updateMessageDto)
    message.isEdited = true

    return await this.messageRepository.save(message)
  }

  async remove(id: string, userId: string): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id, isActive: true },
      relations: ['sender', 'project'],
    })

    if (!message) {
      throw new NotFoundException('Message not found')
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages')
    }

    message.isActive = false
    await this.messageRepository.save(message)
  }

  private async validateProjectAccess(projectId: string, userId: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['owner', 'members'],
    })

    if (!project) {
      throw new NotFoundException('Project not found')
    }

    const hasAccess = 
      project.owner.id === userId ||
      project.members?.some((member) => member.id === userId)

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this project')
    }

    return project
  }
}
