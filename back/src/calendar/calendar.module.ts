import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CalendarController } from './calendar.controller'
import { CalendarService } from './calendar.service'
import { CalendarEvent } from '../entities/calendar-event.entity'
import { User } from '../entities/user.entity'
import { Project } from '../entities/project.entity'
import { Task } from '../entities/task.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([CalendarEvent, User, Project, Task])
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
