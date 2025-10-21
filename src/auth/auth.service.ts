import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(data: any) {
    if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
      throw new BadRequestException('Email обязателен для регистрации');
    }

    const existing = await this.usersService.findByEmail(data.email);
    if (existing)
      throw new ConflictException('Пользователь с таким email уже существует');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(data.email)) {
      throw new BadRequestException('Некорректный формат email');
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const created = await this.usersService.create({
      ...data,
      password: hashedPassword,
      role: 'intern',
    });

    const token = jwt.sign(
      { id: created._id },
      process.env.JWT_SECRET as string,
    );

    created.verifyToken = token;
    await created.save(); // 🔹 сохраняем токен в базе

    const obj: any = created.toObject();
    delete obj.password;

    await this.mailService.sendMail(
      data.email,
      'Добро пожаловать в Aristocrat!',
      `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #eeeeee;
    padding: 30px;
    border-radius: 12px;
  ">
    <div style="
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    ">
<h2 style="color:#222222;">
  Здравствуйте, <span style="color: #ffd700">${data.fullName}</span>!
</h2>
      <p style="color: #222222; font-size: 16px; line-height: 1.6;">
        Владелец отеля <b style="color:#ffc616">Aristocrat</b> добавил вас как нового сотрудника.
        Чтобы завершить регистрацию, перейдите по ссылке ниже и придумайте новый пароль:
      </p>
<a href="http://localhost:3000/admin-panel/verify?token=${token}&email=${data.email}"
   style="
     display: inline-block;
     margin-top: 20px;
     background: #ffc616;
     color: white;
     text-decoration: none;
     padding: 12px 20px;
     font-size: 18px;
     border-radius: 8px;
     font-weight: bold;
     transition: background 0.3s ease;
   "
>Завершить регистрацию</a>


      <p style="color: #999; font-size: 14px; margin-top: 30px;">
        Если вы не ожидаете это письмо, просто проигнорируйте его.
      </p>
    </div>
    <p style="text-align:center; color:#aaa; font-size:12px; margin-top:15px;">
      © ${new Date().getFullYear()} Aristocrat. Все права защищены.
    </p>
  </div>
  `,
    );

    return {
      ...obj,
      token,
      tempPassword,
    };
  }

  async verify({ password, email, token }) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new ConflictException('Пользователь не найден');
    if (user.isVerification)
      throw new ConflictException('Пользователь уже верифицирован');
    if (user.verifyToken !== token)
      throw new ConflictException('Неверный токен верификации');
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.isVerification = true;
    user.verifyToken = null;
    await user.save();
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
