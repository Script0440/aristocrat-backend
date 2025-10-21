import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room, RoomDocument } from './room.schema';
import { Booking, BookingDocument } from '../booking/booking.schema';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async create(data: any): Promise<Room> {
    try {
      const existing = await this.roomModel.findOne({ number: data.number });
      if (existing) {
        throw new BadRequestException({
          ru: 'Комната с таким номером уже существует',
          en: 'Room with this number already exists',
          ge: 'Zimmer mit dieser Nummer existiert bereits',
        });
      }

      const newRoom = new this.roomModel(data);
      return await newRoom.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException({
          ru: 'Ошибка валидации данных',
          en: 'Validation error',
          ge: 'Validierungsfehler',
        });
      }
      throw new BadRequestException({
        ru: 'Неизвестная ошибка при создании комнаты',
        en: 'Unknown error while creating room',
        ge: 'Unbekannter Fehler beim Erstellen des Zimmers',
      });
    }
  }

  async findAll(): Promise<any[]> {
    const rooms = await this.roomModel.find().exec();

    // берём все брони
    const bookings = await this.bookingModel.find().exec();

    // собираем все roomId, которые забронированы хоть раз
    const bookedRoomIds = bookings.map((b) => b.roomId.toString());

    // возвращаем комнаты с статусом: true = свободна, false = занята
    return rooms.map((room) => {
      const roomId = (room._id as Types.ObjectId).toString();
      return {
        ...room.toObject(),
        status: !bookedRoomIds.includes(roomId),
      };
    });
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomModel.findById(id).exec();
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async update(id: string, data: any): Promise<Room> {
    // Проверка на уникальность номера
    if (data.number) {
      const existing = await this.roomModel.findOne({
        number: data.number,
        _id: { $ne: id },
      });
      if (existing) {
        throw new BadRequestException({
          ru: 'Комната с таким номером уже существует',
          en: 'Room with this number already exists',
          ge: 'Zimmer mit dieser Nummer existiert bereits',
        });
      }
    }

    try {
      const updatedRoom = await this.roomModel
        .findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .exec();

      if (!updatedRoom) {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }

      return updatedRoom;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException({
          ru: 'Ошибка валидации данных',
          en: 'Validation error',
          ge: 'Validierungsfehler',
        });
      }
      throw new BadRequestException({
        ru: 'Неизвестная ошибка при обновлении комнаты',
        en: 'Unknown error while updating room',
        ge: 'Unbekannter Fehler beim Aktualisieren des Zimmers',
      });
    }
  }

  async remove(id: string): Promise<Room> {
    const deletedRoom = await this.roomModel.findByIdAndDelete(id).exec();

    if (!deletedRoom) {
      throw new NotFoundException({
        ru: `Комната не найдена`,
        en: `Room with not found`,
        ge: `Zimmer mit der wurde nicht gefunden`,
      });
    }

    return deletedRoom;
  }
}
