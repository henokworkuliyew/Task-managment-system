import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Query, Request, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { CommentsService } from "./comments.service"
import { CreateCommentDto } from "./dto/create-comment.dto"
import { UpdateCommentDto } from "./dto/update-comment.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("comments")
@Controller("comments")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new comment" })
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(createCommentDto, req.user.id)
  }

  @Get()
  @ApiOperation({ summary: "Get comments by entity type and ID" })
  findByEntity(@Query('entityType') entityType: string, @Query('entityId') entityId: string) {
    return this.commentsService.findByEntity(entityType, entityId)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update comment" })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Request() req) {
    return this.commentsService.update(id, updateCommentDto, req.user.id)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete comment" })
  remove(@Param('id') id: string, @Request() req) {
    return this.commentsService.remove(id, req.user.id)
  }
}
