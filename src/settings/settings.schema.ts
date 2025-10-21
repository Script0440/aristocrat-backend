import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SettingsDocument = Settings & Document;

export type SettingType = {
  _id?: Types.ObjectId;
  value: string;
  color: string;
  label: string;
};

@Schema({ timestamps: true })
export class Settings {
  @Prop({
    type: [
      {
        _id: { type: Types.ObjectId, default: () => new Types.ObjectId() },
        value: { type: String, required: true },
        color: { type: String, required: true },
        label: { type: String, required: true },
      },
    ],
    default: [],
  })
  roles: SettingType[];
  @Prop({
    type: [
      {
        _id: { type: Types.ObjectId, default: () => new Types.ObjectId() },
        value: { type: String, required: true },
        color: { type: String, required: true },
        label: { type: String, required: true },
      },
    ],
    default: [],
  })
  typesRooms: SettingType[];

  @Prop({
    type: [
      {
        _id: { type: Types.ObjectId, default: () => new Types.ObjectId() },
        value: { type: String, required: true },
        color: { type: String, required: true },
        label: { type: String, required: true },
      },
    ],
    default: [],
  })
  providers: SettingType[];
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
