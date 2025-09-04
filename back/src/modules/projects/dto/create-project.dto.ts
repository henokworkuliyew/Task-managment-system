import { IsString, IsOptional, IsEnum, IsDateString, IsArray } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
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
  @IsDateString()
  @IsOptional()
  startDate?: Date

  @ApiPropertyOptional({ example: "2024-06-01" })
  @IsDateString()
  @IsOptional()
  endDate?: Date

  @ApiPropertyOptional({ enum: Priority, default: Priority.MEDIUM })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority = Priority.MEDIUM

  @ApiPropertyOptional({ example: ["frontend", "backend", "e-commerce"] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]
}
