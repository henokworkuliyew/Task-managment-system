import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { NotificationsService } from './notifications.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  findAll(@Request() req) {
    return this.notificationsService.findAll(req.query, req.user.id)
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.id)
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.id)
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id)
  }
}
