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
} from "typeorm"
import { TaskStatus, Priority } from "../common/enums"
import { User } from "./user.entity"
import { Project } from "./project.entity"
import { Comment } from './comment.entity'
import { TimeLog } from './time-log.entity'
import { CalendarEvent } from './calendar-event.entity'

@Entity("tasks")
@Index(["status"])
@Index(["assignee"])
@Index(["project"])
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus

  @Column({
    type: "enum",
    enum: Priority,
    default: Priority.MEDIUM,
  })
  priority: Priority

  @Column({ default: 0 })
  progress: number

  @Column({ type: "timestamp", nullable: true })
  deadline: Date

  @Column({ type: "jsonb", nullable: true })
  estimatedHours: number

  @Column("simple-array", { nullable: true })
  tags: string[]

  @Column("simple-array", { nullable: true })
  attachments: string[]

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Relations
  @ManyToOne(
    () => User,
    (user) => user.assignedTasks,
    { nullable: true },
  )
  assignee: User

  @Column({ nullable: true })
  assigneeId: string

  @ManyToOne(
    () => Project,
    (project) => project.tasks,
  )
  project: Project

  @Column()
  projectId: string

  @ManyToOne(
    () => Task,
    (task) => task.subtasks,
    { nullable: true },
  )
  parentTask: Task

  @Column({ nullable: true })
  parentTaskId: string

  @OneToMany(
    () => Task,
    (task) => task.parentTask,
  )
  subtasks: Task[]

  @ManyToMany(
    () => Task,
    (task) => task.dependentTasks,
  )
  @JoinTable({
    name: "task_dependencies",
    joinColumn: { name: "taskId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "dependsOnId", referencedColumnName: "id" },
  })
  dependencies: Task[]

  @ManyToMany(
    () => Task,
    (task) => task.dependencies,
  )
  dependentTasks: Task[]

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[]

  @OneToMany(() => CalendarEvent, (event) => event.task, { cascade: true })
  calendarEvents: CalendarEvent[]

  @OneToMany(
    () => TimeLog,
    (timeLog) => timeLog.task,
  )
  timeLogs: TimeLog[]
}
