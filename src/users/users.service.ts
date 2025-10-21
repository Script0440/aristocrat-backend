import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll() {
    return this.userModel.find().select('-password').exec();
  }

  async me(id: string) {
    const user = await this.userModel.findById(id).select('-password');

    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async create(data: any) {
    const user = new this.userModel(data);
    return user.save();
  }

  async update(id: string, data: any) {
    const updated = await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .select('-password');
    if (!updated) throw new NotFoundException('Пользователь не найден');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.userModel
      .findByIdAndDelete(id)
      .select('-password');
    if (!deleted) throw new NotFoundException('Пользователь не найден');
    return deleted;
  }
}
