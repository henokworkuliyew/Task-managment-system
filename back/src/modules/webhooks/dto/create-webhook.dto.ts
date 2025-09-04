import { IsString, IsUrl, IsArray, IsOptional, IsBoolean } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateWebhookDto {
  @ApiProperty({ example: "Slack Integration" })
  @IsString()
  name: string

  @ApiProperty({ example: "https://hooks.slack.com/services/..." })
  @IsUrl()
  url: string

  @ApiProperty({ example: ["task.created", "task.updated", "task.completed"] })
  @IsArray()
  @IsString({ each: true })
  events: string[]

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean = true

  @ApiPropertyOptional({ example: "Webhook for Slack notifications" })
  @IsString()
  @IsOptional()
  description?: string
}
