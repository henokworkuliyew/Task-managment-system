import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import type { Repository } from 'typeorm'
import type { Comment } from '../../entities/comment.entity' // Changed from type import to regular import for decorator usage
import type { CreateCommentDto } from './dto/create-comment.dto'
import type { UpdateCommentDto } from './dto/update-comment.dto'

@Injectable()
export class CommentsService {
  constructor(private readonly commentRepository: Repository<Comment>) {}

  async create(
    createCommentDto: CreateCommentDto,
    authorId: string
  ): Promise<Comment> {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      author: { id: authorId },
    })

    return this.commentRepository.save(comment)
  }

  async findByEntity(entityType: string, entityId: string): Promise<Comment[]> {
    let whereCondition: any = {}

    switch (entityType) {
      case 'project':
        whereCondition = { projectId: entityId }
        break
      case 'task':
        whereCondition = { taskId: entityId }
        break
      case 'issue':
        whereCondition = { issueId: entityId }
        break
      default:
        throw new Error(`Invalid entity type: ${entityType}`)
    }

    return this.commentRepository.find({
      where: whereCondition,
      relations: ['author'],
      order: { createdAt: 'ASC' },
    })
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    })

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    if (comment.author.id !== userId) {
      throw new ForbiddenException('You can only update your own comments')
    }

    Object.assign(comment, updateCommentDto)
    return this.commentRepository.save(comment)
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    })

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`)
    }

    if (comment.author.id !== userId) {
      throw new ForbiddenException('You can only delete your own comments')
    }

    await this.commentRepository.remove(comment)
  }
}
