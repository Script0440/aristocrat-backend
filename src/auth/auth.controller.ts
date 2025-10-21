import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('verify')
  async verify(
    @Body() body: { password: string; email: string; token: string },
  ) {
    console.log(body);
    return this.authService.verify({
      password: body.password,
      email: body.email,
      token: body.token,
    });
  }

  @Post('register')
  async register(@Body() body: any) {
    console.log(body);
    return this.authService.register(body);
  }
}
