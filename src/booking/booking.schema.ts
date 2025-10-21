import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true, unique: true })
  number: number;

  @Prop({ required: true, unique: true })
  roomId: string;

  @Prop({ required: true })
  guestsList: string[];

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ type: Date, required: true })
  checkIn: Date;

  @Prop({ type: Date, required: true })
  checkOut: Date;

  @Prop({ required: true })
  breakfast: boolean;

  @Prop({ required: true })
  peopleCount: number;

  @Prop({ type: String, required: true })
  provider: string;

  @Prop({ required: false })
  providerId: string;

  @Prop({ required: true })
  totalPrice: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
