import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('roles')
  async getRoles() {
    return this.settingsService.getRoles();
  }

  @Post('roles')
  async addRole(@Body() body: any) {
    return this.settingsService.addRole(body);
  }

  @Delete('roles/:id')
  async removeRole(@Param('id') id: string) {
    return this.settingsService.removeRole(id);
  }

  @Get('typesRoom')
  async getTypesRooms() {
    return this.settingsService.getTypesRooms();
  }

  @Post('typesRoom')
  async addTypeRoom(@Body() body: any) {
    return this.settingsService.addTypeRoom(body);
  }

  @Delete('typesRoom/:id')
  async removeTypeRoom(@Param('id') id: string) {
    return this.settingsService.removeTypeRoom(id);
  }

  @Get('providers')
  async getProviders() {
    return this.settingsService.getProviders();
  }

  @Post('providers')
  async addProvider(@Body() body: any) {
    return this.settingsService.addProvider(body);
  }

  @Delete('providers/:id')
  async removeProvider(@Param('id') id: string) {
    return this.settingsService.removeProvider(id);
  }
}
