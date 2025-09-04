import { IsEmail, IsString, IsEnum, IsOptional, MinLength, IsArray } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { UserRole } from "../../../common/enums"

export class CreateUserDto {
  @ApiProperty({ example: "john.doe@example.com" })
  @IsEmail()
  email: string

  @ApiProperty({ example: "SecurePassword123!" })
  @IsString()
  @MinLength(8)
  password: string

  @ApiProperty({ example: "John Doe" })
  @IsString()
  name: string

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.CONTRIBUTOR })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.CONTRIBUTOR

  @ApiPropertyOptional({ example: "https://res.cloudinary.com/avatar.jpg" })
  @IsString()
  @IsOptional()
  avatar?: string

  @ApiPropertyOptional({ example: "Full-stack developer with 5 years experience" })
  @IsString()
  @IsOptional()
  bio?: string

  @ApiPropertyOptional({ example: ["JavaScript", "React", "Node.js"] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[]

  @ApiPropertyOptional({ example: "Available weekdays 9-5 EST" })
  @IsString()
  @IsOptional()
  availability?: string
}
