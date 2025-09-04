// src/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm'
import { Exclude } from 'class-transformer'
import { UserRole } from '../common/enums'
import { Project } from './project.entity'
import { Task } from './task.entity'
import { Issue } from './issue.entity'
import { Comment } from './comment.entity'
import { NotificationLog } from './notification-log.entity'
import { TimeLog } from './time-log.entity'

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  @Exclude()
  password: string

  @Column()
  name: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CONTRIBUTOR,
  })
  role: UserRole

  @Column({ nullable: true })
  avatar: string

  @Column({ type: 'text', nullable: true })
  bio: string

  @Column('simple-array', { nullable: true })
  skills: string[]

  @Column({ type: 'jsonb', nullable: true })
  availability: Record<string, any>

  @Column({ default: true })
  isActive: boolean

  @Column({ nullable: true })
  refreshToken: string

  @Column({ nullable: true })
  resetPasswordToken: string

  @Column({ nullable: true })
  resetPasswordExpires: Date

  @Column({ nullable: true })
  otpCode: string

  @Column({ nullable: true })
  otpExpires: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Relations
  @OneToMany(() => Project, (project) => project.owner)
  ownedProjects: Project[]

  @ManyToMany(() => Project, (project) => project.members)
  projects: Project[]

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks: Task[]

  @OneToMany(() => Issue, (issue) => issue.assignee)
  assignedIssues: Issue[]

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[]

  @OneToMany(() => NotificationLog, (notification) => notification.user)
  notifications: NotificationLog[]

  @OneToMany(() => TimeLog, (timeLog) => timeLog.user)
  timeLogs: TimeLog[]

  @ManyToMany(() => User, (user) => user.teamMembers)
  @JoinTable({
    name: 'user_teams',
    joinColumn: { name: 'managerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'memberId', referencedColumnName: 'id' },
  })
  managedUsers: User[]

  @ManyToMany(() => User, (user) => user.managedUsers)
  teamMembers: User[]
}
