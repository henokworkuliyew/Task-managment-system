import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from "typeorm"
import { User } from "./user.entity"
import { Project } from "./project.entity"
import { Task } from "./task.entity"

export enum EventType {
  MEETING = "meeting",
  DEADLINE = "deadline", 
  REMINDER = "reminder",
  MILESTONE = "milestone",
  PERSONAL = "personal"
}

export enum EventPriority {
  LOW = "low",
  MEDIUM = "medium", 
  HIGH = "high",
  URGENT = "urgent"
}

export enum EventVisibility {
  PRIVATE = "private",
  PROJECT_MEMBERS = "project_members",
  PUBLIC = "public"
}

@Entity("calendar_events")
@Index(["startDate", "endDate"])
@Index(["createdBy"])
@Index(["project"])
export class CalendarEvent {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ type: "timestamp" })
  startDate: Date

  @Column({ type: "timestamp", nullable: true })
  endDate: Date

  @Column({ default: false })
  allDay: boolean

  @Column({
    type: "enum",
    enum: EventType,
    default: EventType.MEETING
  })
  type: EventType

  @Column({
    type: "enum", 
    enum: EventPriority,
    default: EventPriority.MEDIUM
  })
  priority: EventPriority

  @Column({
    type: "enum",
    enum: EventVisibility, 
    default: EventVisibility.PRIVATE
  })
  visibility: EventVisibility

  @Column({ nullable: true })
  location: string

  @Column({ type: "jsonb", nullable: true })
  attendees: string[]

  @Column({ type: "jsonb", nullable: true })
  reminders: { minutes: number; type: 'email' | 'notification' }[]

  @Column({ default: false })
  isRecurring: boolean

  @Column({ type: "jsonb", nullable: true })
  recurrenceRule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: Date
    count?: number
  }

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Relations
  @ManyToOne(() => User, (user) => user.calendarEvents)
  createdBy: User

  @Column()
  createdById: string

  @ManyToOne(() => Project, (project) => project.calendarEvents, { nullable: true })
  project: Project

  @Column({ nullable: true })
  projectId: string

  @ManyToOne(() => Task, (task) => task.calendarEvents, { nullable: true })
  task: Task

  @Column({ nullable: true })
  taskId: string
}
