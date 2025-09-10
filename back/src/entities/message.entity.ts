import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from "typeorm"
import { User } from "./user.entity"
import { Project } from "./project.entity"

@Entity("messages")
@Index(["project"])
@Index(["sender"])
@Index(["createdAt"])
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "text" })
  content: string

  @Column({ type: "enum", enum: ["text", "file", "image"], default: "text" })
  type: string

  @Column({ type: "jsonb", nullable: true })
  attachments: string[]

  @Column({ default: false })
  isEdited: boolean

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.sentMessages)
  sender: User

  @Column()
  senderId: string

  @ManyToOne(() => Project, (project) => project.messages)
  project: Project

  @Column()
  projectId: string
}
