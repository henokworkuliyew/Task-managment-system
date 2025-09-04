import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from "typeorm"
import { User } from "./user.entity"
import { Task } from "./task.entity"

@Entity("time_logs")
@Index(["user"])
@Index(["task"])
@Index(["startTime"])
export class TimeLog {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "timestamp" })
  startTime: Date

  @Column({ type: "timestamp", nullable: true })
  endTime: Date

  @Column({ type: "int", nullable: true })
  duration: number // in minutes

  @Column({ type: "text", nullable: true })
  description: string

  @Column({ default: false })
  isRunning: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Relations
  @ManyToOne(
    () => User,
    (user) => user.timeLogs,
  )
  user: User

  @Column()
  userId: string

  @ManyToOne(
    () => Task,
    (task) => task.timeLogs,
  )
  task: Task

  @Column()
  taskId: string
}
