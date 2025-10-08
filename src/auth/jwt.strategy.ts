import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // токен из заголовка Authorization: Bearer <token>
      ignoreExpiration: false, // токен истёк — отклонить
      secretOrKey: config.get<string>('JWT_SECRET') || 'supersecretkey', // секрет
    });
  }

  async validate(payload: any) {
    // payload — это объект, который мы подписывали при логине
    // обычно содержит sub (userId), email, role и т.д.
    return { userId: payload.sub, email: payload.email, role: payload.role };
    // возвращаем объект — он попадёт в req.user
  }
}
