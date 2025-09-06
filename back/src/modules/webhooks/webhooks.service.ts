import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { Webhook } from '../../entities/webhook.entity' // Changed from type import to regular import for decorator usage
import type { CreateWebhookDto } from './dto/create-webhook.dto'
import type { UpdateWebhookDto } from './dto/update-webhook.dto'

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(Webhook)
    private readonly webhookRepository: Repository<Webhook>
  ) {}

  async create(
    createWebhookDto: CreateWebhookDto,
    userId: string
  ): Promise<Webhook> {
    const webhook = this.webhookRepository.create({
      ...createWebhookDto,
      user: { id: userId },
    })

    return this.webhookRepository.save(webhook)
  }

  async findAll(userId: string): Promise<Webhook[]> {
    return this.webhookRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: string, userId: string): Promise<Webhook> {
    const webhook = await this.webhookRepository.findOne({
      where: { id, user: { id: userId } },
    })

    if (!webhook) {
      throw new NotFoundException(`Webhook with ID ${id} not found`)
    }

    return webhook
  }

  async update(
    id: string,
    updateWebhookDto: UpdateWebhookDto,
    userId: string
  ): Promise<Webhook> {
    const webhook = await this.findOne(id, userId)

    Object.assign(webhook, updateWebhookDto)
    return this.webhookRepository.save(webhook)
  }

  async remove(id: string, userId: string): Promise<void> {
    const webhook = await this.findOne(id, userId)
    await this.webhookRepository.remove(webhook)
  }

  async triggerWebhook(event: string, payload: any): Promise<void> {
    const webhooks = await this.webhookRepository.find({
      where: { events: event, active: true },
    })

    // In a real implementation, you would send HTTP requests to webhook URLs
    // For now, we'll just log the webhook triggers
    webhooks.forEach((webhook) => {
      console.log(
        `[v0] Triggering webhook ${webhook.id} for event ${event}:`,
        payload
      )
    })
  }
}
