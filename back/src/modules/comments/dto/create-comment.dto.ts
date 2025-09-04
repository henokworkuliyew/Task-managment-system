import { IsString, IsUUID } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateCommentDto {
  @ApiProperty({ example: "This looks great! Just one suggestion..." })
  @IsString()
  content: string

  @ApiProperty({ example: "task", description: "Entity type: task, issue, or project" })
  @IsString()
  entityType: string

  @ApiProperty({ example: "uuid-of-entity" })
  @IsUUID()
  entityId: string
}
