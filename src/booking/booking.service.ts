import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './booking.schema';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async create(data: Partial<Booking>) {
    if (!data || !data.roomId) {
      throw new NotFoundException('Booking data is required');
    }

    const booking = new this.bookingModel(data);
    return booking.save();
  }

  findAll() {
    return this.bookingModel.find().exec();
  }

  findOne(id: string) {
    return this.bookingModel.findById(id).exec();
  }

  update(id: string, data: Partial<Booking>) {
    return this.bookingModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string) {
    return this.bookingModel.findByIdAndDelete(id).exec();
  }
}
