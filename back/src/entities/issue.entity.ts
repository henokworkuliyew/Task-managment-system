import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
} from "typeorm"
import { IssueStatus, IssueSeverity } from "../common/enums"
import { User } from "./user.entity"
import { Project } from "./project.entity"
import { Comment } from "./comment.entity"

@Entity("issues")
@Index(["status"])
@Index(["severity"])
@Index(["project"])
export class Issue {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column({ type: "text" })
  description: string

  @Column({
    type: "enum",
    enum: IssueStatus,
    default: IssueStatus.OPEN,
  })
  status: IssueStatus

  @Column({
    type: "enum",
    enum: IssueSeverity,
    default: IssueSeverity.MEDIUM,
  })
  severity: IssueSeverity

  @Column("simple-array", { nullable: true })
  attachments: string[]

  @Column({ type: "text", nullable: true })
  stepsToReproduce: string

  @Column({ type: "text", nullable: true })
  expectedBehavior: string

  @Column({ type: "text", nullable: true })
  actualBehavior: string

  @Column("simple-array", { nullable: true })
  tags: string[]

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Relations
  @ManyToOne(
    () => User,
    (user) => user.assignedIssues,
    { nullable: true },
  )
  assignee: User

  @Column({ nullable: true })
  assigneeId: string

  @ManyToOne(
    () => Project,
    (project) => project.issues,
  )
  project: Project

  @Column()
  projectId: string

  @ManyToOne(() => User)
  reporter: User

  @Column()
  reporterId: string

  @OneToMany(
    () => Comment,
    (comment) => comment.issue,
  )
  comments: Comment[]
}
