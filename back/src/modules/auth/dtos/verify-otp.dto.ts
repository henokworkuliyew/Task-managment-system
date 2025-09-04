import { IsEmail, IsString, Length } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class VerifyOtpDto {
  @ApiProperty({ example: "john.doe@example.com" })
  @IsEmail()
  email: string

  @ApiProperty({ example: "123456" })
  @IsString()
  @Length(6, 6)
  otp: string
}
