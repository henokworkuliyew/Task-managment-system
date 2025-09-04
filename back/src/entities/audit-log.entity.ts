import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from "typeorm"
import { User } from "./user.entity"

@Entity("audit_logs")
@Index(["user"])
@Index(["entityType"])
@Index(["action"])
@Index(["timestamp"])
export class AuditLog {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  action: string

  @Column()
  entityType: string

  @Column()
  entityId: string

  @Column({ type: "jsonb", nullable: true })
  oldValues: Record<string, any>

  @Column({ type: "jsonb", nullable: true })
  newValues: Record<string, any>

  @Column({ type: "inet", nullable: true })
  ipAddress: string

  @Column({ nullable: true })
  userAgent: string

  @CreateDateColumn()
  timestamp: Date

  // Relations
  @ManyToOne(() => User, { nullable: true })
  user: User

  @Column({ nullable: true })
  userId: string
}
