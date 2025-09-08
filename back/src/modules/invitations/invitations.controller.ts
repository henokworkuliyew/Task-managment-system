import { Controller, Get, Post, Param, Query, UseGuards, Request, BadRequestException, NotFoundException } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { InvitationsService } from "./invitations.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("invitations")
@Controller("invitations")
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Get("accept")
  @ApiOperation({ summary: "Accept project invitation via token" })
  async acceptInvitation(@Query('token') token: string, @Request() req) {
    if (!token) {
      throw new BadRequestException('Invitation token is required')
    }
    
    // If user is authenticated, use their ID, otherwise handle registration flow
    const userId = req.user?.id || null
    return this.invitationsService.acceptInvitation(token, userId)
  }

  @Get("decline")
  @ApiOperation({ summary: "Decline project invitation via token" })
  async declineInvitation(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Invitation token is required')
    }
    
    return this.invitationsService.declineInvitation(token)
  }

  @Get("verify/:token")
  @ApiOperation({ summary: "Verify invitation token and get invitation details" })
  async verifyInvitation(@Param('token') token: string) {
    return this.invitationsService.verifyInvitation(token)
  }

  @Get("my-invitations")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user's pending invitations" })
  async getMyInvitations(@Request() req) {
    return this.invitationsService.getUserInvitations(req.user.email)
  }

  @Post("accept/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Accept invitation by ID (for authenticated users)" })
  async acceptInvitationById(@Param('id') id: string, @Request() req) {
    return this.invitationsService.acceptInvitationById(id, req.user.id)
  }
}
