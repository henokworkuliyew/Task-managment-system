import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm'
import { Project } from './project.entity'
import { User } from './user.entity'

@Entity('project_invitations')
@Index(['email', 'project'])
export class ProjectInvitation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  email: string

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'declined', 'expired'],
    default: 'pending',
  })
  status: string

  @Column()
  token: string

  @Column()
  expiresAt: Date

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  project: Project

  @Column()
  projectId: string

  @ManyToOne(() => User, { nullable: true })
  invitedBy: User

  @Column()
  invitedById: string

  @ManyToOne(() => User, { nullable: true })
  acceptedBy: User

  @Column({ nullable: true })
  acceptedById: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
