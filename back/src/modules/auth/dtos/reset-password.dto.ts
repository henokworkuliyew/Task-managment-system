import { IsString, MinLength, MaxLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class ResetPasswordDto {
  @ApiProperty({ example: "reset-token-here" })
  @IsString()
  token: string

  @ApiProperty({ example: "NewSecurePassword123!" })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  newPassword: string
}
