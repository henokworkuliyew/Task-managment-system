import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { MessagesService, CreateMessageDto, UpdateMessageDto } from './messages.service'
import { Message } from '../../entities/message.entity'

@ApiTags('messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message to project chat' })
  async create(
    @Body(ValidationPipe) createMessageDto: CreateMessageDto,
    @Request() req: any,
  ): Promise<Message> {
    return this.messagesService.create(createMessageDto, req.user.id)
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get messages for a project' })
  async getProjectMessages(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Request() req: any,
  ) {
    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)
    return this.messagesService.findByProject(projectId, req.user.id, pageNum, limitNum)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit a message' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateMessageDto: UpdateMessageDto,
    @Request() req: any,
  ): Promise<Message> {
    return this.messagesService.update(id, updateMessageDto, req.user.id)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    await this.messagesService.remove(id, req.user.id)
    return { message: 'Message deleted successfully' }
  }
}
