import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomDocument = Room & Document;

export enum RoomProvider {
  OSTROVOK = 'OSTROVOK',
  BOOKING = 'BOOKING',
  NONE = 'NONE',
}

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, unique: true })
  number: number;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ required: true })
  checkIn: String;

  @Prop({ required: true })
  checkOut: String;

  @Prop({ required: true })
  peopleCount: number;

  @Prop({ type: String, required: true, enum: RoomProvider })
  provider: RoomProvider;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
