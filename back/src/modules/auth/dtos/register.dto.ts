import { IsEmail, IsString, MinLength, MaxLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class RegisterDto {
  @ApiProperty({ example: "john.doe@example.com" })
  @IsEmail()
  email: string

  @ApiProperty({ example: "SecurePassword123!" })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string

  @ApiProperty({ example: "John Doe" })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string
}
