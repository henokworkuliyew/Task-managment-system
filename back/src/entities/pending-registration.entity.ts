import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm'

@Entity('pending_registrations')
@Index(['email'], { unique: true })
export class PendingRegistration {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column()
  name: string

  @Column()
  otpCode: string

  @Column()
  otpExpires: Date

  @CreateDateColumn()
  createdAt: Date
}
