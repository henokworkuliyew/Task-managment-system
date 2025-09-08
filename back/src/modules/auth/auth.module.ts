import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { BullModule } from "@nestjs/bull"

import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { User } from "../../entities/user.entity"
import { PendingRegistration } from "../../entities/pending-registration.entity"
import { UsersModule } from "../users/users.module"
import { EmailService } from "./email.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PendingRegistration]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: '24h',
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy,
    EmailService
  ],
  exports: [AuthService, EmailService],
})
export class AuthModule {}
