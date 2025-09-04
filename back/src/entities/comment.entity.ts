import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"
import { User } from "./user.entity"
import { Project } from "./project.entity"
import { Task } from "./task.entity"
import { Issue } from "./issue.entity"

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "text" })
  content: string

  @Column("simple-array", { nullable: true })
  mentions: string[]

  @Column("simple-array", { nullable: true })
  attachments: string[]

  @Column({ default: false })
  isEdited: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Relations
  @ManyToOne(
    () => User,
    (user) => user.comments,
  )
  author: User

  @Column()
  authorId: string

  @ManyToOne(
    () => Project,
    (project) => project.comments,
    { nullable: true },
  )
  project: Project

  @Column({ nullable: true })
  projectId: string

  @ManyToOne(
    () => Task,
    (task) => task.comments,
    { nullable: true },
  )
  task: Task

  @Column({ nullable: true })
  taskId: string

  @ManyToOne(
    () => Issue,
    (issue) => issue.comments,
    { nullable: true },
  )
  issue: Issue

  @Column({ nullable: true })
  issueId: string

  @ManyToOne(
    () => Comment,
    (comment) => comment.replies,
    { nullable: true },
  )
  parentComment: Comment

  @Column({ nullable: true })
  parentCommentId: string

  @OneToMany(
    () => Comment,
    (comment) => comment.parentComment,
  )
  replies: Comment[]
}
