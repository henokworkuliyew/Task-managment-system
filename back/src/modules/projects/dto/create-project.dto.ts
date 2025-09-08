import { IsString, IsOptional, IsEnum, IsDateString, IsArray, IsEmail } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { Priority } from "../../../common/enums"

export class CreateProjectDto {
  @ApiProperty({ example: "E-commerce Platform" })
  @IsString()
  name: string

  @ApiPropertyOptional({ example: "A modern e-commerce platform with React and Node.js" })
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({ example: "2024-01-01" })
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsOptional()
  startDate?: Date

  @ApiPropertyOptional({ example: "2024-06-01" })
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsOptional()
  endDate?: Date

  @ApiPropertyOptional({ enum: Priority, default: Priority.MEDIUM })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority = Priority.MEDIUM

  @ApiPropertyOptional({ 
    enum: ['not_started', 'in_progress', 'completed', 'on_hold'], 
    default: 'not_started' 
  })
  @IsEnum(['not_started', 'in_progress', 'completed', 'on_hold'])
  @IsOptional()
  status?: string = 'not_started'

  @ApiPropertyOptional({ example: ["frontend", "backend", "e-commerce"] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]

  @ApiPropertyOptional({ 
    example: ["john@example.com", "jane@example.com"], 
    description: "Email addresses of users to invite as project members" 
  })
  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  memberEmails?: string[]
}
