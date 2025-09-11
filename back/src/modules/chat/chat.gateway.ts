import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UseGuards, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MessagesService } from '../messages/messages.service'

interface AuthenticatedSocket extends Socket {
  userId?: string
  user?: any
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(ChatGateway.name)
  private connectedUsers = new Map<string, string>() // socketId -> userId

  constructor(
    private jwtService: JwtService,
    private messagesService: MessagesService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    this.logger.log(`New connection attempt: ${client.id}`)
    
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '')
      
      if (!token) {
        this.logger.warn(`Client ${client.id} attempted to connect without token`)
        client.emit('error', { message: 'Authentication required' })
        client.disconnect()
        return
      }

      const payload = this.jwtService.verify(token)
      client.userId = payload.sub
      client.user = payload

      this.connectedUsers.set(client.id, client.userId)
      
      this.logger.log(`User ${client.userId} connected with socket ${client.id}`)
      
      // Join user to their own room for direct messages
      client.join(`user:${client.userId}`)
      
      // Send connection success
      client.emit('connected', { userId: client.userId })
      
    } catch (error) {
      this.logger.error(`Authentication failed for socket ${client.id}:`, error.message)
      client.emit('error', { message: 'Authentication failed' })
      client.disconnect()
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = this.connectedUsers.get(client.id)
    if (userId) {
      this.connectedUsers.delete(client.id)
      this.logger.log(`User ${userId} disconnected`)
    }
  }

  @SubscribeMessage('join-project')
  async handleJoinProject(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { projectId: string },
  ) {
    try {
      // Validate user has access to project
      await this.messagesService.findByProject(data.projectId, client.userId, 1, 1)
      
      // Join project room
      client.join(`project:${data.projectId}`)
      
      this.logger.log(`User ${client.userId} joined project ${data.projectId}`)
      
      // Notify other users in the project
      client.to(`project:${data.projectId}`).emit('user-joined', {
        userId: client.userId,
        user: client.user,
      })
      
    } catch (error) {
      this.logger.error(`Failed to join project ${data.projectId}:`, error.message)
      client.emit('error', { message: 'Failed to join project chat' })
    }
  }

  @SubscribeMessage('leave-project')
  async handleLeaveProject(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { projectId: string },
  ) {
    client.leave(`project:${data.projectId}`)
    
    // Notify other users
    client.to(`project:${data.projectId}`).emit('user-left', {
      userId: client.userId,
    })
    
    this.logger.log(`User ${client.userId} left project ${data.projectId}`)
  }

  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { projectId: string; content: string; type?: 'text' | 'file' | 'image' },
  ) {
    try {
      // Create message in database
      const message = await this.messagesService.create(
        {
          content: data.content,
          type: (data.type as 'text' | 'file' | 'image') || 'text',
          projectId: data.projectId,
        },
        client.userId,
      )

      // Get full message with sender info
      const fullMessage = await this.messagesService.findByProject(
        data.projectId,
        client.userId,
        1,
        1,
      )

      const messageToSend = fullMessage.data[0]

      // Broadcast to all users in the project room
      this.server.to(`project:${data.projectId}`).emit('new-message', messageToSend)
      
      this.logger.log(`Message sent by ${client.userId} to project ${data.projectId}`)
      
    } catch (error) {
      this.logger.error(`Failed to send message:`, error.message)
      client.emit('error', { message: 'Failed to send message' })
    }
  }

  @SubscribeMessage('typing-start')
  handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { projectId: string },
  ) {
    client.to(`project:${data.projectId}`).emit('user-typing', {
      userId: client.userId,
      user: client.user,
      isTyping: true,
    })
  }

  @SubscribeMessage('typing-stop')
  handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { projectId: string },
  ) {
    client.to(`project:${data.projectId}`).emit('user-typing', {
      userId: client.userId,
      user: client.user,
      isTyping: false,
    })
  }

  // Method to send notifications to specific users
  async sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification)
  }

  // Method to broadcast project updates
  async broadcastProjectUpdate(projectId: string, update: any) {
    this.server.to(`project:${projectId}`).emit('project-update', update)
  }
}
