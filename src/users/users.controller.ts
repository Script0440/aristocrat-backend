import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, // вот здесь внедриваем сервис
  ) {}

  @Get()
  async findAll() {
    console.log('Fetching all users');
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return null;

    try {
      const payload = this.jwtService.verify(token); // декодируем токен
      const userId = payload.sub; // тут твой ObjectId
      return this.usersService.me(userId);
    } catch (err) {
      return null; // токен некорректный или просрочен
    }
  }

  @Roles('owner')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    console.log(body, id);
    return this.usersService.update(id, body);
  }

  // Удалить пользователя по id — только owner
  @Delete(':id')
  async remove(@Param('id') id: string) {
    console.log(`Deleting user with id: ${id}`);
    return this.usersService.remove(id);
  }
}
