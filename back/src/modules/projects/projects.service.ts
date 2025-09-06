import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { Project } from '../../entities/project.entity'
import type { CreateProjectDto } from './dto/create-project.dto'
import type { UpdateProjectDto } from './dto/update-project.dto'
import type { PaginationDto } from '../../common/dtos/pagination.dto'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    ownerId: string
  ): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      owner: { id: ownerId },
    })

    return this.projectRepository.save(project)
  }

  async findAll(paginationDto: PaginationDto, userId: string) {
    const { page = 1, limit = 10 } = paginationDto
    const skip = (page - 1) * limit

    const [projects, total] = await this.projectRepository.findAndCount({
      where: [{ owner: { id: userId } }, { members: { id: userId } }],
      relations: ['owner', 'members'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    })

    return {
      data: projects,
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
