import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'
import { Message } from '../../entities/message.entity'
import { User } from '../../entities/user.entity'
import { Project } from '../../entities/project.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Project])],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
