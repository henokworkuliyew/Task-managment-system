import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from '../../entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PaginationDto } from '../../common/dtos/pagination.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12)

    const userData = {
      ...createUserDto,
      password: hashedPassword,
      availability: createUserDto.availability
        ? JSON.parse(createUserDto.availability as string)
        : null,
    }

    const user = this.userRepository.create(userData)
    return this.userRepository.save(user)
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto
    const skip = (page - 1) * limit

    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      select: [
        'id',
        'email',
        'name',
        'role',
        'avatar',
        'bio',
        'skills',
        'availability',
        'createdAt',
      ],
    })

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'name',
        'role',
        'avatar',
        'bio',
        'skills',
        'availability',
        'createdAt',
      ],
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } })
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id)

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12)
    }

    Object.assign(user, updateUserDto)
    return this.userRepository.save(user)
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id)
    await this.userRepository.softDelete(id)
  }

  async getUsersByProject(projectId: string): Promise<User[]> {
    console.log(`[getUsersByProject] Fetching users for project: ${projectId}`)
    
    // Get all users associated with the project (both members and owner)
    const project = await this.userRepository.manager
      .getRepository('Project')
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.members', 'members')
      .where('project.id = :projectId', { projectId })
      .getOne()

    console.log(`[getUsersByProject] Found project:`, project ? 'YES' : 'NO')
    if (project) {
      console.log(`[getUsersByProject] Owner:`, project.owner ? project.owner.name : 'NONE')
      console.log(`[getUsersByProject] Members count:`, project.members ? project.members.length : 0)
      if (project.members) {
        project.members.forEach(member => console.log(`[getUsersByProject] Member: ${member.name} (${member.id})`))
      }
    }

    if (!project) {
      console.log(`[getUsersByProject] Project not found, returning empty array`)
      return []
    }

    const allUsers: User[] = []
    
    // Add owner if exists
    if (project.owner) {
      allUsers.push(project.owner)
      console.log(`[getUsersByProject] Added owner: ${project.owner.name}`)
    }

    // Add members if they exist
    if (project.members && project.members.length > 0) {
      project.members.forEach(member => {
        // Only add if not already in the list (avoid duplicates)
        if (!allUsers.find(user => user.id === member.id)) {
          allUsers.push(member)
          console.log(`[getUsersByProject] Added member: ${member.name}`)
        } else {
          console.log(`[getUsersByProject] Skipped duplicate member: ${member.name}`)
        }
      })
    }

    console.log(`[getUsersByProject] Total users to return: ${allUsers.length}`)

    // Select only the fields we need
    return allUsers.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      availability: user.availability,
      createdAt: user.createdAt,
    } as User))
  }
}
