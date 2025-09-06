import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm'
import { Priority } from '../common/enums'
import { User } from './user.entity'
import { Task } from './task.entity'
import { Issue } from './issue.entity'
import { Comment } from './comment.entity'

@Entity('projects')
@Index(['owner'])
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'date', nullable: true })
  startDate: Date

  @Column({ type: 'date', nullable: true })
  endDate: Date

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.MEDIUM,
  })
  priority: Priority

  @Column('simple-array', { nullable: true })
  tags: string[]

  @Column({ default: 0 })
  progress: number

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
 
  @ManyToOne(() => User, (user) => user.ownedProjects)
  owner: User

  @Column()
  ownerId: string

  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable({
    name: 'project_members',
    joinColumn: { name: 'projectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  members: User[]

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[]

  @OneToMany(() => Issue, (issue) => issue.project)
  issues: Issue[]

  @OneToMany(() => Comment, (comment) => comment.project)
  comments: Comment[]
}
