import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Settings, SettingsDocument } from './settings.schema';
import { Model } from 'mongoose';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
  ) {}

  // Получаем единственный документ с настройками
  async getSettings(): Promise<SettingsDocument> {
    let settings = await this.settingsModel.findOne();

    // Если его нет — создаём
    if (!settings) {
      settings = await this.settingsModel.create({ roles: [] });
    }

    return settings;
  }

  // Возвращаем список ролей
  async getRoles() {
    const settings = await this.getSettings();
    return settings.roles;
  }

  // Добавляем новую роль в единственный документ
  async addRole(roleData: { color: string; label: string }) {
    if (!roleData) throw new NotFoundException('Role data is required');
    const value = roleData.label;
    const settings = await this.getSettings();
    settings.roles.push({ ...roleData, value });
    await settings.save();

    return settings.roles;
  }

  async removeRole(id: string) {
    if (!id) {
      throw new NotFoundException('Role not found');
    }

    const settings = await this.getSettings();

    // Удаляем роль
    settings.roles = settings.roles.filter(
      (role) => role._id!.toString() !== id,
    );

    await settings.save();
    return settings.roles;
  }

  async getTypesRooms() {
    const settings = await this.getSettings();
    return settings.typesRooms;
  }

  async addTypeRoom(typeData) {
    if (!typeData) throw new NotFoundException('Type data is required');
    const value = typeData.label;
    const settings = await this.getSettings();
    settings.typesRooms.push({ ...typeData, value });
    await settings.save();

    return settings.typesRooms;
  }

  async removeTypeRoom(id: string) {
    if (!id) {
      throw new NotFoundException('Type not found');
    }
    const settings = await this.getSettings();

    settings.typesRooms = settings.typesRooms.filter(
      (type) => type._id!.toString() !== id,
    );

    await settings.save();
    return settings.typesRooms;
  }

  async getProviders() {
    const settings = await this.getSettings();
    return settings.providers;
  }

  async addProvider(providerData) {
    if (!providerData) throw new NotFoundException('Provider data is required');
    const value = providerData.label;
    const settings = await this.getSettings();
    settings.providers.push({ ...providerData, value });
    await settings.save();

    return settings.providers;
  }

  async removeProvider(id: string) {
    if (!id) {
      throw new NotFoundException('Provider not found');
    }
    const settings = await this.getSettings();

    settings.providers = settings.providers.filter(
      (type) => type._id!.toString() !== id,
    );

    await settings.save();
    return settings.providers;
  }
}
