import { IsString, IsUUID, IsOptional } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class StartTimeLogDto {
  @ApiProperty({ example: "uuid-of-task" })
  @IsUUID()
  taskId: string

  @ApiPropertyOptional({ example: "Working on authentication implementation" })
  @IsString()
  @IsOptional()
  description?: string
}
