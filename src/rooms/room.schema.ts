import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomDocument = Room & Document;

export enum RoomTypes {
  STANDART_DOUBLE_ROOM = 'STANDART_DOUBLE_ROOM',
  STANDART_TRIPLE_ROOM = 'STANDART_TRIPLE_ROOM',
  FAMILY_STUDIO_ROOM = 'FAMILY_STUDIO_ROOM',
}

export enum RoomBeds {
  TWIN_BED = 'TWIN_BED',
  SINGLE_BED = 'SINGLE_BED',
  KING_BED = 'KING_BED',
}

export enum RoomItems {
  ALARM = 'ALARM',
  SERVICE = 'SERVICE',
  CLEANING = 'CLEANING',
  HAIRDRYER = 'HAIRDRYER',
  AIRCONDITIONER = 'AIRCONDITIONER',
  TV = 'TV',
  FRIDGE = 'FRIDGE',
  HYGIENE = 'HYGIENE',
}

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, unique: true })
  number: number;

  @Prop({ required: true, enum: RoomTypes })
  type: RoomTypes;

  @Prop({ required: true })
  size: number;

  @Prop({ type: [String], enum: RoomBeds, required: true })
  beds: RoomBeds[];

  @Prop({ required: true })
  balcony: boolean;

  @Prop({ required: true })
  price: number;

  @Prop({ default: false })
  isClean: boolean;

  @Prop({ default: false })
  status: boolean;

  @Prop({ required: true })
  mainImage: string;

  @Prop({ type: [String], required: true })
  images: string[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
