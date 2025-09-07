import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { ConfigService } from "@nestjs/config"
import { AuthService } from "../auth.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    })
    console.log('JWT Strategy initialized with secret:', configService.get<string>("JWT_SECRET") ? 'SECRET_SET' : 'SECRET_MISSING')
  }

  async validate(payload: any) {
    console.log('JWT Strategy - Validating payload:', payload)
    try {
      const user = await this.authService.validateUser(payload)
      if (!user) {
        console.log('JWT Strategy - User not found or inactive')
        throw new UnauthorizedException()
      }
      console.log('JWT Strategy - User validated successfully:', user.id)
      return user
    } catch (error) {
      console.log('JWT Strategy - Validation error:', error.message)
      throw new UnauthorizedException()
    }
  }
}
