import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Request, Body, Inject } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"
import { WebhooksService } from "./webhooks.service"
import { CreateWebhookDto } from "./dto/create-webhook.dto"
import { UpdateWebhookDto } from "./dto/update-webhook.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("webhooks")
@Controller("webhooks")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WebhooksController {
  constructor(
    @Inject(WebhooksService) private readonly webhooksService: WebhooksService
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new webhook" })
  create(@Body() createWebhookDto: CreateWebhookDto, @Request() req) {
    return this.webhooksService.create(createWebhookDto, req.user.id)
  }

  @Get()
  @ApiOperation({ summary: 'Get all webhooks for user' })
  findAll(@Request() req) {
    return this.webhooksService.findAll(req.user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get webhook by ID" })
  findOne(@Param('id') id: string, @Request() req) {
    return this.webhooksService.findOne(id, req.user.id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update webhook" })
  update(@Param('id') id: string, @Body() updateWebhookDto: UpdateWebhookDto, @Request() req) {
    return this.webhooksService.update(id, updateWebhookDto, req.user.id)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete webhook" })
  remove(@Param('id') id: string, @Request() req) {
    return this.webhooksService.remove(id, req.user.id)
  }
}
