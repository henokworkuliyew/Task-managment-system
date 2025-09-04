import { IsString, IsOptional } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"

export class StopTimeLogDto {
  @ApiPropertyOptional({ example: "Completed JWT implementation and testing" })
  @IsString()
  @IsOptional()
  description?: string
}
