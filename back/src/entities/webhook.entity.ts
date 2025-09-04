import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm"
import { User } from "./user.entity"

@Entity("webhooks")
export class Webhook {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column()
  url: string

  @Column("text", { array: true })
  events: string[]

  @Column({ default: true })
  active: boolean

  @Column({ nullable: true })
  description?: string

  @Column({ nullable: true })
  secret?: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
