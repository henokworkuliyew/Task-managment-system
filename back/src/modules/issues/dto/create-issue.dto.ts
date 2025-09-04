import { IsString, IsOptional, IsEnum, IsUUID, IsArray } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IssueStatus, IssueSeverity } from '../../../common/enums'

export class CreateIssueDto {
  @ApiProperty({ example: 'Login button not working' })
  @IsString()
  title: string

  @ApiPropertyOptional({
    example:
      'When clicking login button, nothing happens. Console shows 404 error.',
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({ enum: IssueStatus, default: IssueStatus.OPEN })
  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus = IssueStatus.OPEN

  @ApiPropertyOptional({ enum: IssueSeverity, default: IssueSeverity.MEDIUM })
  @IsEnum(IssueSeverity)
  @IsOptional()
  severity?: IssueSeverity = IssueSeverity.MEDIUM

  @ApiProperty({ example: 'uuid-of-project' })
  @IsUUID()
  projectId: string

  @ApiPropertyOptional({ example: 'uuid-of-assignee' })
  @IsUUID()
  @IsOptional()
  assigneeId?: string

  @ApiPropertyOptional({
    example: [
      'https://res.cloudinary.com/screenshot1.png',
      'https://res.cloudinary.com/log-file.txt',
    ],
    description:
      'Array of Cloudinary URLs for issue attachments (screenshots, logs, etc.) uploaded from frontend',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[]
}
