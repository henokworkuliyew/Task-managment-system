import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from "typeorm"
import { NotificationType } from "../common/enums"
import { User } from "./user.entity"

@Entity("notification_logs")
@Index(["user"])
@Index(["read"])
export class NotificationLog {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  message: string

  @Column({
    type: "enum",
    enum: NotificationType,
  })
  type: NotificationType

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @Column({ default: false })
  read: boolean

  @CreateDateColumn()
  createdAt: Date

  // Relations
  @ManyToOne(
    () => User,
    (user) => user.notifications,
  )
  user: User

  @Column()
  userId: string
}
