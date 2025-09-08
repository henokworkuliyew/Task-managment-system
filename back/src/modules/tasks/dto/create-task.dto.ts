import { IsString, IsOptional, IsEnum, IsDateString, IsUUID, IsNumber, Min, Max, IsArray } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { TaskStatus, Priority } from "../../../common/enums"

export class CreateTaskDto {
  @ApiProperty({ example: "Implement user authentication" })
  @IsString()
  title: string

  @ApiPropertyOptional({ example: "Create JWT-based authentication system with login/register" })
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.TODO })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.TODO

  @ApiPropertyOptional({ example: 0, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number = 0

  @ApiPropertyOptional({ example: "2024-12-31" })
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsOptional()
  deadline?: Date

  @ApiProperty({ example: "uuid-of-project" })
  @IsUUID()
  projectId: string

  @ApiPropertyOptional({ example: "uuid-of-assignee" })
  @IsUUID()
  @IsOptional()
  assigneeId?: string

  @ApiPropertyOptional({ enum: Priority, default: Priority.MEDIUM })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority = Priority.MEDIUM

  @ApiPropertyOptional({
    example: ["https://res.cloudinary.com/file1.pdf", "https://res.cloudinary.com/image1.jpg"],
    description: "Array of Cloudinary URLs for task attachments uploaded from frontend",
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[]

  @ApiPropertyOptional({ example: ["uuid-of-dependency-task"] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  dependencyIds?: string[]

  @ApiPropertyOptional({ example: 8, description: "Estimated hours to complete the task" })
  @IsNumber()
  @Min(0)
  @IsOptional()
  estimatedHours?: number

  @ApiPropertyOptional({ example: ["frontend", "urgent"], description: "Tags for categorizing tasks" })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]
}
