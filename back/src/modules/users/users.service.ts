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
}
