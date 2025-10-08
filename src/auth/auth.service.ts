import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: any) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing)
      throw new ConflictException('Пользователь с таким email уже существует');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const created = await this.usersService.create({
      ...data,
      password: hashedPassword,
      role: 'intern', // задаём роль явно
    });

    const obj: any = created.toObject();
    delete obj.password;
    return obj;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new ConflictException('Неверный email или пароль');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ConflictException('Неверный email или пароль');

    const payload = { sub: user._id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
