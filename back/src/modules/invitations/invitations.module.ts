import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvitationsController } from './invitations.controller'
import { InvitationsService } from './invitations.service'
import { ProjectInvitation } from '../../entities/project-invitation.entity'
import { Project } from '../../entities/project.entity'
import { User } from '../../entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ProjectInvitation, Project, User])],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
